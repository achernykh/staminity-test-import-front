import { noop, id, flatMap, unique, keys, entries, pipe, object, allEqual, capitalize } from '../share/util.js';
import './management.component.scss';


class ManagementCtrl {

    constructor ($scope, $mdDialog, $translate, GroupService, dialogs, $mdMedia, $mdBottomSheet, message) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$translate = $translate;
        this.$mdBottomSheet = $mdBottomSheet;
        this.GroupService = GroupService;
        this.dialogs = dialogs;
        this.message = message;
        this.isScreenSmall = $mdMedia('max-width: 959px');

        this.orderings = {
            username: (member) => `${member.userProfile.public.firstName} ${member.userProfile.public.lastName}`,
            tariff: (member) => member.billing && member.billing.map(t => t.tariffCode).join(', '),
            city: (member) => member.userProfile.public.city,
            ageGroup: (member) => member.userProfile.public.sex,
            roles: (member) => member.roleMembership.join(' '),
            coaches: (member) => member.coaches.map(c => c.userId).join(' '),
            athletes: (member) => this.athletes(member).map(a => a.userProfile.userId).join(' '),
        };
        this.orderBy = 'sort.username';
        this.checked = [];
    }

    $onInit(){
        this.clearFilter();
        this.sortingHotfix();
    }
    
    update () {
        return this.GroupService.getManagementProfile(this.club.groupId,'club')
            .then((management) => { 
                this.management = management;
                this.checked = [];
                this.sortingHotfix();
                this.$scope.$apply();
            }, (error) => { 
                this.message.systemError(error);
            });
    }

    sortingHotfix () {
        this.management.members.forEach(member => {
            member.coaches = (member.coaches || []).filter(userId => this.management.members.find(m => m.userProfile.userId === userId))
            member.sort = keys(this.orderings).reduce((r, key) => (r[key] = this.orderings[key] (member), r), {})
        });
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
                groupId: this.club.groupId
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true

        })
    }

    // tariffs & billing 
    
    isOurBill (bill) {
        return bill.clubProfile && bill.clubProfile.groupId == this.club.groupId;
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
    
    get tariffsAvailable () {
        return allEqual(this.checked.map(m => this.tariffsByUs(m)), angular.equals)
            && allEqual(this.checked.map(m => this.tariffsBySelf(m)), angular.equals);
    }

    editTariffsMessage (changes) {
        let addTariffs = changes.filter(({ direction }) => direction === "I");
        let removeTariffs = changes.filter(({ direction }) => direction === "O");
        let translateTariffCode = ({ tariffCode }) => '«' + this.$translate.instant(`dialogs.${tariffCode}`) + '»';

        if (addTariffs.length && removeTariffs.length) {
            return this.$translate.instant('users.editTariffs.confirm.text.addAndRemove', { 
                addTariffCodes: addTariffs.map(translateTariffCode).join(', '),
                removeTariffCodes: removeTariffs.map(translateTariffCode).join(', ')
            });
        } else if (addTariffs.length && !removeTariffs.length) {
            return (
                addTariffs.length > 1 && this.$translate.instant('users.editTariffs.confirm.text.addMany', { tariffCodes: addTariffs.map(translateTariffCode).join(', ') }) ||
                addTariffs.length === 1 && this.$translate.instant('users.editTariffs.confirm.text.addOne', { tariffCode: translateTariffCode(addTariffs[0]) })
            );
        } else if (!addTariffs.length && removeTariffs.length) {
            return (
                removeTariffs.length > 1 && this.$translate.instant('users.editTariffs.confirm.text.removeMany', { tariffCodes: removeTariffs.map(translateTariffCode).join(', ') }) ||
                removeTariffs.length === 1 && this.$translate.instant('users.editTariffs.confirm.text.removeOne', { tariffCode: translateTariffCode(removeTariffs[0]) })
            );
        }
    }
    
    editTariffs () {
        let tariffs = ['Coach', 'Premium'];
        let checked = this.checked;
        let byUs = this.tariffsByUs(checked[0]);
        let bySelf = this.tariffsBySelf(checked[0]);

        this.dialogs.tariffs(tariffs, byUs, bySelf, 'dialogs.byClub')
        .then((selectedTariffs) => {
            let changes = tariffs
                .filter((tariffCode) => selectedTariffs.includes(tariffCode) != byUs.includes(tariffCode))
                .map((tariffCode) => ({
                    tariffCode,
                    direction: selectedTariffs.includes(tariffCode)? 'I' : 'O'
                }));

            let confirmDialogMessages = {
                title: this.$translate.instant(`users.editTariffs.confirm.title`),
                text: this.editTariffsMessage(changes),
                confirm: this.$translate.instant(`users.editTariffs.confirm.confirm`),
                cancel: this.$translate.instant(`users.editTariffs.confirm.cancel`)
            };

            return this.dialogs.confirm(confirmDialogMessages, changes);
        })
        .then((changes) => {
            let members = checked.map(member => member.userProfile.userId);

            let memberships = changes.map(({ tariffCode, direction }) => ({
                direction, 
                groupId: this.management.tariffGroups[tariffCode + 'ByClub']
            }));

            return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
        })
        .then((result) => { 
            result && this.update();
        }, (error) => { 
            if (error) {
                this.message.systemError(error);
                this.update(); 
            }
        });
    }

    // coaches
    
    get coaches () {
        return this.management.members.filter(m => (m.roleMembership || []).includes('ClubCoaches'))
    }
    
    get coachesAvailable () {
        return allEqual(this.checked.map((user) => user.coaches), angular.equals) 
            && this.checked.every(m => (m.roleMembership || []).includes('ClubAthletes'))
    }
    
    editCoaches () {
        let checked = this.checked
        let checkedCoaches = checked[0].coaches || []
        let coaches = this.coaches
            .map((coach) => ({
                userProfile: coach.userProfile,
                ClubAthletesGroupId: coach.ClubAthletesGroupId,
                checked: checkedCoaches.includes(coach.userProfile.userId)
            }))

        this.dialogs.selectUsers(coaches, 'coaches')
        .then((coaches) => {
            if (!coaches) return;

            let members = checked.map(member => member.userProfile.userId);
            let memberships = coaches
            .filter(coach => !!coach.checked != !!checkedCoaches.includes(coach.userProfile.userId))
            .map(coach => ({
                groupId: coach.ClubAthletesGroupId,
                direction: coach.checked? 'I' : 'O'
            }));

            return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
        })
        .then((result) => { 
            result && this.update(); 
        }, (error) => { 
            if (error) {
                this.message.systemError(error);
                this.update(); 
            }
        });
    }

    // athletes
    
    get athletesAvailable () {
        return allEqual(this.checked.map((member) => this.athletes(member)), angular.equals)
            && this.checked.every(m => (m.roleMembership || []).includes('ClubCoaches'))
    }
    
    editAthletes () {
        let checked = this.checked
        let checkedAthletes = this.athletes(checked[0])
        let athletes = this.management.members
            .filter(m => (m.roleMembership || []).includes('ClubAthletes'))
            .map(athlete => ({
                userProfile: athlete.userProfile,
                checked: checkedAthletes.includes(athlete)
            }))

        this.dialogs.selectUsers(athletes, 'athletes')
        .then((athletes) => {
            if (!athletes) return;
            // нельзя выполнить все действия одним батч-запросом, но можно двумя
            let athletesToAdd = athletes    
                .filter(athlete => athlete.checked && !checkedAthletes.find(a => a.userProfile === athlete.userProfile))
                .map(athlete => athlete.userProfile.userId)
            let athletesToRemove = athletes
                .filter(athlete => !athlete.checked && checkedAthletes.find(a => a.userProfile === athlete.userProfile))
                .map(athlete => athlete.userProfile.userId)
            let addMemberships = checked.map(coach => ({
                groupId: coach.ClubAthletesGroupId,
                direction: 'I'
            }))
            let removeMemberships = checked.map(coach => ({
                groupId: coach.ClubAthletesGroupId,
                direction: 'O'
            }))

            return Promise.all([
                this.GroupService.putGroupMembershipBulk(this.club.groupId, addMemberships, athletesToAdd),
                this.GroupService.putGroupMembershipBulk(this.club.groupId, removeMemberships, athletesToRemove)
            ])
        })
        .then((result) => { 
            result && this.update(); 
        }, (error) => { 
            if (error) {
                this.message.systemError(error);
                this.update(); 
            }
        });
    }

    // roles
    
    get rolesAvailable() {
        return allEqual(this.checked.map((user) => user.roleMembership), angular.equals)
    }

    editRolesMessage (changes) {
        let addRoles = changes.filter(({ direction }) => direction === "I");
        let removeRoles = changes.filter(({ direction }) => direction === "O")
        let translateRole = ({ role }) => this.$translate.instant(`dialogs.${role}`);

        if (addRoles.length && removeRoles.length) {
            return this.$translate.instant('users.editRoles.confirm.text.addAndRemove', { 
                addRoles: addRoles.map(translateRole).join(', '), 
                removeRoles: removeRoles.map(translateRole).join(', ')
            });
        } else if (addRoles.length && !removeRoles.length) {
            return (
                addRoles.length > 1 && this.$translate.instant('users.editRoles.confirm.text.addMany', { roles: addRoles.map(translateRole).join(', ') }) ||
                addRoles.length === 1 && this.$translate.instant(`users.editRoles.confirm.text.addOne.${addRoles[0].role}`)
            );
        } else if (!addRoles.length && removeRoles.length) {
            return (
                removeRoles.length > 1 && this.$translate.instant('users.editRoles.confirm.text.removeMany', { roles: removeRoles.map(translateRole).join(', ') }) ||
                removeRoles.length === 1 && this.$translate.instant(`users.editRoles.confirm.text.removeOne.${removeRoles[0].role}`)
            );
        }
    }
    
    editRoles () {
        let checked = this.checked
        let checkedRoles = checked[0].roleMembership || []
        let roles = ['ClubAthletes', 'ClubCoaches', 'ClubManagement']
            .map((role) => ({ role, checked: checkedRoles.includes(role) }));

        this.dialogs.roles(roles)
        .then((roles) => {
            let changes = roles
                .filter(({ role, checked }) => !!checked != !!checkedRoles.includes(role))
                .map(({ role, checked }) => ({ role, direction: checked? 'I' : 'O' }));

            let confirmDialogMessages = {
                title: this.$translate.instant(`users.editRoles.confirm.title`),
                text: this.editRolesMessage(changes),
                confirm: this.$translate.instant(`users.editRoles.confirm.confirm`),
                cancel: this.$translate.instant(`users.editRoles.confirm.cancel`)
            };

            return this.dialogs.confirm(confirmDialogMessages, changes);
        })
        .then((changes) => {
            let members = checked.map((member) => member.userProfile.userId);

            let memberships = changes.map(({ role, direction }) => ({
                groupId: this.management.availableGroups[role],
                direction
            }));

            return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
        })
        .then((result) => { 
            result && this.update();
        }, (error) => {
            if (error) {
                this.message.systemError(error);
                this.update(); 
            }
        });
    }

    // removing & other actions
    
    remove () {
        this.dialogs.confirm({ text: 'dialogs.excludeClub' })
        .then(() => Promise.all(this.checked.map((m) => this.GroupService.leave(this.club.groupId, m.userProfile.userId))))
        .then((result) => { 
            result && this.update();
        }, (error) => { 
            error && this.message.systemError(error);
        });
    }
    
    showActions (member) {
        this.management.members.forEach((m) => { m.checked = m === member })
        
        this.$mdBottomSheet.show({
            template: require('./member-actions.html'),
            scope: this.$scope
        })
    }

    // orderingand filtering
    
    clearFilter () {
        this.filter = {
            pred: () => true,
            label: 'Все',
            none: true,
        }
    }
    
    filterNoCoach () {
        this.filter = {
            pred: (member) => !member.coaches || !member.coaches.length,
            label: 'Без тренера',
            noCoach: true,
        }
    }
    
    filterCoach (coach) {
        this.filter = {
            pred: (member) => member.coaches && member.coaches.find(userId => userId === coach.userProfile.userId),
            label: coach.userProfile.public.firstName + ' ' +  coach.userProfile.public.lastName,
            coach: coach
        }
    }
    
    filterRole (role) {
        this.filter = {
            pred: (member) => member.roleMembership && member.roleMembership.find((r) => r === role),
            label: role,
            role: role
        }
    }

    // helpers
    
    member (id) {
        return this.management.members.find(m => m.userProfile.userId === id)
    }

    athletes (member) {
        return this.management.members.filter((m) => m.coaches.includes(member.userProfile.userId));
    }

    roleMembership (roleMemberships) {
        roleMemberships = ['ClubManagement', 'ClubCoaches', 'ClubAthletes'].filter(m => roleMemberships.includes(m));

        if (!roleMemberships || !roleMemberships.length) {
            return;
        } else if (roleMemberships.length == 1) {
            return roleMemberships[0];
        } else if (roleMemberships.length > 1) {
            return `${roleMemberships[0]}, +${roleMemberships.length - 1}`;
        } 
    }

    isPremium (member) {
        return member.userProfile.billing.find(tariff => tariff.tariffCode == 'Premium');
    }
};

ManagementCtrl.$inject = ['$scope','$mdDialog','$translate','GroupService','dialogs','$mdMedia','$mdBottomSheet','message'];


let ManagementComponent = {

    bindings: {
        view: '<',
        club: '<',
        management: '<'
    },
    require: {
        app: '^staminityApplication'
    },
    controller: ManagementCtrl,
    template: require('./management.component.html'),

};

export default ManagementComponent;

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
