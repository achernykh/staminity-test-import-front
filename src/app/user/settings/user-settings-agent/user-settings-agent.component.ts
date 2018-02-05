import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IAgentProfile } from "@api/agent";
import { UserSettingsService } from '../user-settings.service';
import { AgentService } from '../agent.service';
import DisplayService from "../../../core/display.service";
import { UserSettingsAgentDatamodel, UserSettingsAgentOwnerDatamodel } from './user-settings-agent.datamodel';
import { countriesList } from '../user-settings.constants';
import './user-settings-agent.component.scss';

class UserSettingsAgentCtrl {
    
    // bind
    currentUser: IUserProfile; 
    set agentProfile (profile: IAgentProfile) {
        this.datamodel = new UserSettingsAgentDatamodel(profile);
    };
    set owner (profile: IUserProfile) {
        this.ownerDatamodel = new UserSettingsAgentOwnerDatamodel(profile);
    };

    // public
    datamodel: UserSettingsAgentDatamodel;
    ownerDatamodel: UserSettingsAgentOwnerDatamodel;
    form: any;
    countriesList = countriesList;
    countrySearchText: string;

    static $inject = ['DisplayService', 'dialogs', 'message', 'UserSettingsService', 'AgentService', 'quillConfig', '$scope'];

    constructor (
        private displayService: DisplayService,
        private dialogs: any,
        private message: any,
        private userSettingsService: UserSettingsService,
        private agentService: AgentService,
        private quillConfig: any,
        private $scope: any,
    ) {
        window['UserSettingsAgentCtrl'] = this;
    }

    canSubmit () : boolean {
        return this.form.$valid;
    }

    /**
     * Сохранить 
     */
    submit () {
        if (this.datamodel.isIndividual) {
            this.userSettingsService.saveSettings(this.ownerDatamodel.toUserProfile());
        }

        this.agentService.putAgentProfile(this.datamodel.toAgentProfile())
        .then(() => { 
            this.form.$setPristine(true);
            this.message.toastInfo('settingsSaveComplete'); 
            this.$scope.$apply(); 
        })
        .catch((info) => { 
            this.message.systemWarning(info); 
        }); 
    }

    /**
     * Поиск страны
     * @param query: string
     * @returns {string[]}
     */
    countrySearch (query: string) : string[] {
        return this.userSettingsService.countrySearch(query);
    }

    /**
     * Название страны
     * @param key: string
     * @returns {string}
     */
    getCountryName (key: string) : string {
        return countriesList[this.displayService.getLocale()][key];
    }
}

export const UserSettingsAgentComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<'
    },
    controller: UserSettingsAgentCtrl,
    template: require('./user-settings-agent.component.html') as string
} as any;