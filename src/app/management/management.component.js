import { flatMap, unique, keys, entries, pipe, object, allEqual } from '../share/util.js';
import './management.component.scss';


class ManagementCtrl {

    constructor ($scope, $mdDialog, GroupService, dialogs, $mdMedia, $mdBottomSheet, SystemMessageService) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$mdBottomSheet = $mdBottomSheet;
        this.GroupService = GroupService;
        this.dialogs = dialogs;
        this.SystemMessageService = SystemMessageService;
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
        this.clearFilter();
        this.sortingHotfix();

        this.checked = [];
    }
    
    update () {
        return this.GroupService.getManagementProfile(this.club.groupId,'club')
            .then((management) => { 
                this.management = management;
                this.checked = [];
                this.sortingHotfix();
                this.$scope.$apply();
            }, (error) => { this.SystemMessageService.show(error) })
    }

    sortingHotfix () {
        this.management.members.forEach(member => {
            member.coaches = (member.coaches || []).filter(userId => this.management.members.find(m => m.userProfile.userId === userId))
            member.sort = keys(this.orderings).reduce((r, key) => (r[key] = this.orderings[key] (member), r), {})
        });
    }

    // tariffs & billing 
    
    isOurBill (bill) {
        return bill.clubProfile && bill.clubProfile.groupId == this.club.groupId;
    }
    
    isBilledByUs (member, tariffCode) {
        return !!member.userProfile.billing.find(b => b.tariffCode == tariffCode && this.isOurBill(b));
    }
    
    isBilledBySelf (member, tariffCode) {
        return !!member.userProfile.billing.find(b => b.tariffCode == tariffCode && !this.isOurBill(b));
    }

    tariffs (member) {
        return ['Coach', 'Premium'].map(tariffCode => ({
            tariffCode,
            byUs: this.isBilledByUs(member, tariffCode),
            bySelf: this.isBilledBySelf(member, tariffCode)
        }));
    }
    
    get tariffsAvailable () {
        return allEqual(this.checked.map(m => this.tariffs(m)), angular.equals)
    }
    
    editTariffs () {
        let checked = this.checked
        let tariffs = this.tariffs(checked[0])

        this.dialogs.tariffs(tariffs, 'byClub')
        .then(tariffs => {
            if (!tariffs) return;

            let members = checked.map(member => member.userProfile.userId);
            let memberships = tariffs
                .filter(t => t.byUs != this.isBilledByUs(checked[0], t.tariffCode))
                .map(t => ({
                    groupId: this.management.tariffGroups[t.tariffCode + 'ByClub'],
                    direction: t.byUs? 'I' : 'O'
                }));

            return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
        }, () => {})
        .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error); this.update(); })
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

        this.dialogs.selectUsers(coaches) 
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
        }, () => {})
        .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error); this.update(); })
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

        this.dialogs.selectUsers(athletes) 
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
        }, () => {})
        .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error); this.update(); })
    }

    // roles
    
    get rolesAvailable() {
        return allEqual(this.checked.map((user) => user.roleMembership), angular.equals)
    }
    
    editRoles () {
        let checked = this.checked
        let checkedRoles = checked[0].roleMembership || []
        let roles = ['ClubAthletes', 'ClubCoaches', 'ClubManagement']
            .map((role) => ({
                role: role,
                checked: checkedRoles.includes(role)
            }))

        this.dialogs.roles(roles)
        .then((roles) => {
            if (!roles) return;

            let members = checked.map(member => member.userProfile.userId);
            let memberships = roles
            .filter(role => !!role.checked != !!checkedRoles.includes(role.role))
            .map(role => ({
                groupId: this.management.availableGroups[role.role],
                direction: role.checked? 'I' : 'O'
            }));

            return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
        }, () => {})
        .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error); this.update(); })
    }

    // removing & other actions
    
    remove () {
        this.dialogs.confirm('Удалить пользователей?')
        .then((confirmed) => confirmed && Promise.all(this.checked.map((m) => this.GroupService.leave(this.club.groupId, m.userProfile.userId))), () => {})
        .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error) })
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

ManagementCtrl.$inject = ['$scope','$mdDialog','GroupService','dialogs','$mdMedia','$mdBottomSheet','SystemMessageService'];


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
