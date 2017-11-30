import { IGroupManagementProfile, IGroupManagementProfileMember, IUserProfile, IBillingTariff, IBulkGroupMembership } from '../../../api';
import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { createSelector } from "../share/utility";
import { inviteDialogConf } from '../management/invite/invite.dialog';
import { AthletesService } from './athletes.service';
import { getMemberUsername, athletesOrderings } from './athletes.functions';
import { arrays, functions } from '../share/utility';
import './athletes.component.scss';

class AthletesCtrl {

    user: IUserProfile;
    management: IGroupManagementProfile;
    search: string;
    orderBy: string = 'username';
    checked: Array<IGroupManagementProfileMember> = [];    

    /**
     * Отфильтрованный и отсортированный список членов
     * @returns {Array<Member>}
     */  
    getRows: () => Array<IGroupManagementProfileMember> = createSelector([
        () => this.management,
        () => this.search,
        () => this.orderBy,
    ], (management: IGroupManagementProfile, search: string, orderString: string) => {
        let isReverseOrder = orderString.startsWith('-');
        let order = athletesOrderings[isReverseOrder ? orderString.slice(1) : orderString];
        return functions.pipe([
            arrays.filter((member) => getMemberUsername(member).includes(search)),
            arrays.orderBy(order),
            isReverseOrder ? arrays.reverse : functions.id
        ]) (management.members);
    });

    static $inject = ['$scope', '$mdDialog', '$translate', 'GroupService', 'AthletesService', 'dialogs', '$mdMedia', '$mdBottomSheet', 'SystemMessageService', 'GroupService'];
 
    constructor (
        private $scope: any, 
        private $mdDialog: any, 
        private $translate: any, 
        private GroupService: any, 
        private AthletesService: AthletesService, 
        private dialogs: any, 
        private $mdMedia: any, 
        private $mdBottomSheet: any, 
        private SystemMessageService: any
    ) {     

    }
    
    /**
     * Обновить
     */ 
    update () {
        return this.GroupService.getManagementProfile(this.management.groupId, 'coach')
            .then((management) => { 
                this.management = management;
                this.checked = [];
                this.$scope.$apply();
            }, (error) => { 
                this.SystemMessageService.show(error); 
            });
    }

    /**
     * Доступна ли при выбранных строчках кнопка "Удалить"
     * @returns {boolean}
     */  
    isRemoveAvailable () : boolean {
        return this.AthletesService.isRemoveAvailable(this.user, this.checked);
    }
    
    /**
     * Доступна ли при выбранных строчках кнопка "Тарифы"
     * @returns {boolean}
     */  
    isEditTariffsAvailable () : boolean {
        return this.AthletesService.isEditTariffsAvailable(this.user, this.checked);
    }
    
    /**
     * Действие над выбранными строчками по кнопке "Тарифы"
     */  
    editTariffs () {
        this.AthletesService.editTariffs(this.user, this.management, this.checked)
        .then((result) => { 
            if (result) {
                this.update();
            }
        }, (error) => { 
            if (error) {
                this.SystemMessageService.show(error); 
                this.update(); 
            }
        });
    }

    /**
     * Действие над выбранными строчками по кнопке "Удалить"
     */  
    remove () {
        this.AthletesService.remove(this.management, this.checked)
        .then((result) => { 
            if (result) {
                this.update();
            }
        }, (error) => { 
            if (error) {
                this.SystemMessageService.show(error);
            }
        });
    }
    
    /**
     * Действие по кнопке "Меню" члена клуба в мобильной версии
     * @param member: Member
     */  
    showActions (member: IGroupManagementProfileMember) {
        this.checked = [member];
        
        this.$mdBottomSheet.show({
            template: require('./member-actions.html'),
            scope: this.$scope,
            preserveScope: true
        });
    }

    isPremium (member: IGroupManagementProfileMember) {
        return member.userProfile.billing.find(tariff => tariff.tariffCode === 'Premium');
    }

    /**
     * Действие по кнопке "Пригласить в клуб"
     * @param $event
     */  
    invite ($event) {
        this.$mdDialog.show(inviteDialogConf(this.user.connections.Athletes.groupId, $event));
    }

    /**
     * Использовать ли мобильную вёрстку
     * @returns {boolean}
    */  
    isMobileLayout () : boolean {
        return this.$mdMedia('max-width: 959px');
    }
};


const AthletesComponent: IComponentOptions = <any> {

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