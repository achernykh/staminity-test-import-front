import { element } from 'angular';
import { Subject } from "rxjs/Rx";
import { GetAgentEnvironment, GetAgentProfile, PutAgentProfile, IAgentProfile, IAgentEnvironment } from "../../../../api/agent";
import DisplayService from "../../core/display.service";
import UserService from "../../core/user.service";
import { countriesList } from './user-settings.constants';
import { UserSettingsPasswordCtrl } from './user-settings-password/user-settings-password.dialog';

export class AgentService {

    public updates = new Subject<IAgentProfile>();

    static $inject = ['SocketService', '$mdDialog', 'message'];

    constructor (
        private SocketService,
        private $mdDialog,
        private message,
    ) {

    }

    /**
     * Запрос профиля продавца ТП
     * @returns {Promise<IAgentProfile>}
     */
    getAgentProfile() : Promise<IAgentProfile> {
        return this.SocketService.send(new GetAgentProfile());
    }

    /**
     * Изменение профиля продавца ТП
     * @param {profile: IAgentProfile}
     * @returns {Promise<any>}
     */
    putAgentProfile(profile: IAgentProfile) : Promise<any> {
        return this.SocketService.send(new PutAgentProfile(profile))
        .then(() => {
            this.getAgentProfile()
            .then((agentProfile) => {
                this.updates.next(agentProfile);
            });
        });
    }

    /**
     * Запрос IAgentEnvironment
     * @returns {Promise<any>}
     */
    getAgentEnvironment() : Promise<any> {
        return this.SocketService.send(new GetAgentEnvironment());
    }
}
