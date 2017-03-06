import './athlete-selector.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import SessionService from "../../core/session.service";
import GroupService from "../../core/group.service";
import MessageService from "../../core/message.service";
import {IGroupManagementProfileMember} from "../../../../api/group/group.interface";

class AthleteSelectorCtrl implements IComponentController {

    public data: any;
    onAnswer: (response: {uri: string}) => IPromise<void>;
    onCancel: (response: Object) => IPromise<void>;
    private athletes: Array<IGroupManagementProfileMember>;
    static $inject = ['SessionService','GroupService'];

    constructor(
        private SessionService: SessionService,
        private GroupService: GroupService,
        private message: MessageService) {

    }

    $onInit() {
        let groupId = this.SessionService.getUser().connections['allAthletes'].groupId;
        if (groupId) {
            this.GroupService.getManagementProfile(groupId,'coach')
                .then(result => this.athletes = result.members);
        } else {
            this.message.systemWarning('Группы атлетов не найдена, попробуйте повторить позже');
        }
    }
}

const AthleteSelectorComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onCancel: '&',
        onAnswer: '&'
    },
    controller: AthleteSelectorCtrl,
    template: require('./athlete-selector.component.html') as string
};

export default AthleteSelectorComponent;