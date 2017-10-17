import './athlete-selector.component.scss';
import {IComponentOptions, IComponentController, IPromise,IScope} from 'angular';
import {ISessionService, getUser} from "../../core/session.service";
import GroupService from "../../core/group.service";
import MessageService from "../../core/message.service";
import {IGroupManagementProfileMember} from "../../../../api/group/group.interface";
import {IUserProfile} from "../../../../api/user/user.interface";
import {Subject} from 'rxjs/Rx';

class AthleteSelectorCtrl implements IComponentController {

    public data: any;
    onAnswer: (response: {uri: string}) => IPromise<void>;
    onCancel: (response: Object) => IPromise<void>;
    private athletes: Array<IGroupManagementProfileMember>;
    private destroy = new Subject();

    static $inject = ['SessionService','GroupService','message','$scope'];

    constructor(
        private SessionService: ISessionService,
        private GroupService: GroupService,
        private message: MessageService,
        private $scope: IScope
    ) {
        SessionService.getObservable()
        .takeUntil(this.destroy)
        .map(getUser)
        .subscribe((profile) => {
            this.athletes = angular.copy(profile.connections.allAthletes.groupMembers);
        });
    }

    $onInit() {
        /**let groupId = this.SessionService.getUser().connections['allAthletes'].groupId;
        if (groupId) {
            this.GroupService.getManagementProfile(groupId,'coach')
                .then(result => this.athletes = result.members)
                .then(() => !this.$scope.$$phase && this.$scope.$apply());
        } else {
            this.message.systemWarning('allAthletesGroupNotFound');
        }**/
    }

    $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
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