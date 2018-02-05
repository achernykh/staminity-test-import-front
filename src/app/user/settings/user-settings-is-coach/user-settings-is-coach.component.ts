import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { isCoachProfileComplete } from '../user-settings-coach/user-settings-coach.functions';
import { UserSettingsService } from '../user-settings.service';
import DisplayService from "../../../core/display.service";
import './user-settings-is-coach.component.scss';

class UserSettingsIsCoachCtrl {
    
    // bind
    currentUser: IUserProfile;
    owner: IUserProfile;
    agentProfile: any;

    static $inject = ['DisplayService', 'dialogs', 'message', 'UserSettingsService', '$scope'];

    constructor (
        private displayService: DisplayService,
        private dialogs: any,
        private message: any,
        private userSettingsService: UserSettingsService,
        private $scope: any,
    ) {
        window['UserSettingsIsCoachCtrl'] = this;
    }

    /**
     * Активен ли тариф "Тренер"
     * @returns {boolean}
     */
    isCoachTariffEnabled () : boolean {
        return !!this.owner.billing.tariffs.find((tariff) => tariff.tariffCode === "Coach" && tariff['isOn']);
    }

    /**
     * Статус тренера
     * @returns {string}
     */
    getStatus () : string {
        const { isCoach } = this.owner.public;
        const { Athletes } = this.owner.connections;
        return !isCoach && !Athletes ? 'addCoachTariff' :
            !isCoach && Athletes ? 'off' :
            isCoach && this.isCoachTariffEnabled() ? 'coachTariffEnabled' :
            isCoach && this.agentProfile.isActive ? 'planSellerEnabled' : 'on';
    }

    /**
     * Неактивность переключателя
     * @returns {boolean}
     */
    isDisabled () : boolean {
        return this.owner.public.isCoach && (this.agentProfile.isActive || this.isCoachTariffEnabled());
    }

    /**
     * Геттер-сеттер isCoach
     * @param value?: boolean
     * @returns {boolean | void}
     */
    isCoach (value?: boolean) : boolean | void { 
        if (typeof value === 'undefined') { 
            return this.owner.public['isCoach']; 
        } 
 
        this.userSettingsService.saveSettings({ 
            userId: this.owner.userId,
            revision: this.owner.revision,
            public: { 
                ...this.owner.public,
                isCoach: value,
            },
        }) 
        .then(() => { 
            this.owner.public['isCoach'] = value; 
            this.message.toastInfo('settingsSaveComplete'); 
            this.$scope.$apply(); 
        }) 
        .catch((info) => { 
            this.message.systemWarning(info); 
        }); 
    }

    /* 
     * Перезагрузить профиль
     */
    reload () {
        this.userSettingsService.reload(this.owner.userId); 
    }

    /**
     * Заполнен ли профиль тренера
     * @returns {boolean}
     */
    isCoachProfileComplete () : boolean {
        return this.owner.public.profileComplete;
    }
}

export const UserSettingsIsCoachComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<'
    },
    controller: UserSettingsIsCoachCtrl,
    template: require('./user-settings-is-coach.component.html') as string
} as any;