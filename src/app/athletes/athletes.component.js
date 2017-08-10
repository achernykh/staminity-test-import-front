import { noop, flatMap, unique, keys, entries, pipe, object, allEqual } from '../share/util.js';
import './athletes.component.scss';


class AthletesCtrl {

    constructor ($scope, $mdDialog, $translate, GroupService, dialogs, $mdMedia, $mdBottomSheet, SystemMessageService) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$translate = $translate;
        this.$mdBottomSheet = $mdBottomSheet;
        this.GroupService = GroupService;
        this.dialogs = dialogs;
        this.SystemMessageService = SystemMessageService;
        this.isScreenSmall = $mdMedia('max-width: 959px');
        
        this.orderings = {
            username: (member) => `${member.userProfile.public.firstName} ${member.userProfile.public.lastName}`,
            club: (member) => '-',
            tariff: (member) => member.billing && member.billing.map(t => t.tariffCode).join(', '),
            city: (member) => member.userProfile.public.city,
            ageGroup: (member) => member.userProfile.public.sex
        };
        this.orderBy = 'username';
        this.checked = [];
    }

    $onInit() {
        this.sortingHotfix();
        console.log('AthletesCtrl', this);
    }

    sortingHotfix () {
        this.management.members = this.management.members || [];

        this.management.members.forEach((member) => {
            member.sort = keys(this.orderings).reduce((r, key) => (r[key] = this.orderings[key] (member), r), {})
        });
    }
    
    update () {
        return this.GroupService.getManagementProfile(this.user.connections.Athletes.groupId, 'coach')
            .then((management) => { 
                this.management = management;
                this.checked = [];
                this.sortingHotfix(); 
                this.$scope.$apply();
            }, (error) => { 
                this.SystemMessageService.show(error); 
            });
    }

    // tariffs & billing 
    
    isOurBill (bill) {
        return bill.userProfilePayer && bill.userProfilePayer.userId == this.user.userId;
    }
    
    tariffsByUs (member) {
        return member.userProfile.billing
            .filter(bill => this.isOurBill(bill))
            .map(bill => bill.tariffCode);
    }
    
    tariffsBySelf (member) {
        return member.userProfile.billing
            .filter(bill => !this.isOurBill(bill))
            .map(bill => bill.tariffCode);
    }

    isClubAthlete () {
        let ownClubIds = this.user.connections.Clubs.map((club) => club.groupId);
        return (member) => member.clubs && member.clubs.find((club) => ownClubIds.includes(club.groupId));
    }

    get removeAvailable () {
        let isClubAthlete = this.isClubAthlete();
        return this.checked.every((m) => !isClubAthlete(m));
    }
    
    get tariffsAvailable () {
        let isClubAthlete = this.isClubAthlete();
        return this.checked.every((m) => !isClubAthlete(m))
            && allEqual(this.checked.map(m => this.tariffsByUs(m)), angular.equals)
            && allEqual(this.checked.map(m => this.tariffsBySelf(m)), angular.equals);
    }

    editTariffsMessage (changes) {
        let addTariffs = changes
            .filter(({ direction }) => direction === "I")
            .map(({ tariffCode }) => '«' + this.$translate.instant(`dialogs.${tariffCode}`) + '»');
        let removeTariffs = changes
            .filter(({ direction }) => direction === "O")
            .map(({ tariffCode }) => '«' + this.$translate.instant(`dialogs.${tariffCode}`) + '»');

        return capitalize([(
            addTariffs.length > 1 && this.$translate.instant('athletes.editTariffs.addMany', { tariffCodes: addTariffs.join(', ') }) ||
            addTariffs.length === 1 && this.$translate.instant('athletes.editTariffs.addOne', { tariffCode: addTariffs[0] })
        ), (
            removeTariffs.length > 1 && this.$translate.instant('athletes.editTariffs.removeMany', { tariffCodes: removeTariffs.join(', ') }) ||
            removeTariffs.length === 1 && this.$translate.instant('athletes.editTariffs.removeOne', { tariffCode: removeTariffs[0] })
        )].filter(id).join(', '));
    }
    
    editTariffs () {
        let tariffs = ['Premium'];
        let checked = this.checked;
        let byUs = this.tariffsByUs(checked[0]);
        let bySelf = this.tariffsBySelf(checked[0]);

        this.dialogs.tariffs(tariffs, byUs, bySelf, 'dialogs.byCoach')
        .then((selectedTariffs) => {
            let changes = tariffs
                .filter((tariffCode) => selectedTariffs.includes(tariffCode) != byUs.includes(tariffCode))
                .map((tariffCode) => ({
                    tariffCode,
                    direction: selectedTariffs.includes(tariffCode)? 'I' : 'O'
                }));

            let message = this.editTariffsMessage(changes);

            return this.dialogs.confirm({ text: message }, changes);
        })
        .then((changes) => {
            let members = checked.map(member => member.userProfile.userId);

            let memberships = changes.map(({ tariffCode, direction }) => ({
                direction, 
                groupId: this.management.tariffGroups[tariffCode + 'ByCoach']
            }));

            return this.GroupService.putGroupMembershipBulk(this.user.connections.Athletes.groupId, memberships, members);
        })
        .then((result) => { 
            result && this.update(); 
        }, (error) => { 
            if (error) {
                this.SystemMessageService.show(error); 
                this.update(); 
            }
        });
    }

    // removing & other actions
    
    remove () {
        this.dialogs.confirm({ text: 'dialogs.turnOffAthletes' })
        .then(() => Promise.all(this.checked.map((m) => this.GroupService.leave(this.user.connections.Athletes.groupId, m.userProfile.userId))))
        .then((result) => { 
            result && this.update();
        }, (error) => { 
            error && this.SystemMessageService.show(error);
        });
    }
    
    showActions (member) {
        this.management.members.forEach((m) => { m.checked = m === member })
        
        this.$mdBottomSheet.show({
            template: require('./member-actions.html'),
            scope: this.$scope
        })
    }

    invite($event){
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="athlete-invitation" aria-label="Invitation">
                        <athlete-invitation
                                flex layout="column" class=""
                                group-id="$ctrl.groupId"                            
                                on-cancel="cancel()" on-answer="answer(response)">
                        </athlete-invitation>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                groupId: this.user.connections.Athletes.groupId
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true

        })
    }

    // helpers

    isPremium (member) {
        return member.userProfile.billing.find(tariff => tariff.tariffCode == 'Premium');
    }
};

AthletesCtrl.$inject = ['$scope','$mdDialog', '$translate','GroupService','dialogs','$mdMedia','$mdBottomSheet','SystemMessageService'];


const AthletesComponent = {

    bindings: {
        view: '<',
        user: '<',
        management: '<'
    },

    require: {
        app: '^staminityApplication'
    },

    controller: AthletesCtrl,

    template: require('./athletes.component.html'),

};

export default AthletesComponent;

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        console.log('cancel');
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
DialogController.$inject = ['$scope','$mdDialog'];

