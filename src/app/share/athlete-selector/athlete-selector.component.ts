import './athlete-selector.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import SessionService from "../../core/session.service";
import GroupService from "../../core/group.service";
import MessageService from "../../core/message.service";
import {IGroupManagementProfileMember} from "../../../../api/group/group.interface";
import {IScope} from 'angular';

class AthleteSelectorCtrl implements IComponentController {

    public data: any;
    onAnswer: (response: {uri: string}) => IPromise<void>;
    onCancel: (response: Object) => IPromise<void>;
    private athletes: Array<IGroupManagementProfileMember>;
    static $inject = ['SessionService','GroupService','message','$scope'];

    constructor(
        private SessionService: SessionService,
        private GroupService: GroupService,
        private message: MessageService,
        private $scope: IScope) {

    }

    $onInit() {
        let groupId = this.SessionService.getUser().connections['allAthletes'].groupId;
        if (groupId) {
            this.GroupService.getManagementProfile(groupId,'coach')
                .then(result => this.athletes = result.members)
                .then(() => !this.$scope.$$phase && this.$scope.$apply());
        } else {
            this.message.systemWarning('allAthletesGroupNotFound');
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