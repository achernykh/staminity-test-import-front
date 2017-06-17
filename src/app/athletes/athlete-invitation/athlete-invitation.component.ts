import './athlete-invitation.component.scss';
import {IComponentOptions, IComponentController, IPromise, copy} from 'angular';
import AuthService from "../../auth/auth.service";
import {IAuthService} from "../../auth/auth.service";
import {IUserProfile} from "../../../../api/user/user.interface";
import {UserCredentials} from "../../../../api/auth/auth.request";
import MessageService from "../../core/message.service";

class AthleteInvitationCtrl implements IComponentController {

    public coach: IUserProfile;
    public onEvent: (response: Object) => IPromise<void>;
    public onCancel: () => IPromise<void>;

    private credTempl: UserCredentials = {
        public: {
            firstName: '',
            lastName: '',
            avatar: 'default.jpg',
            background: 'default.jpg'
        },
        display: {
            units: 'metric',
            firstDayOfWeek: 1,
            timezone: 'Europe/Moscow',
            language: 'ru'
        },
        email: '',
        password: '',
        activateCoachTrial: false,
        activatePremiumTrial: true
    };
    private users: Array<UserCredentials> = [];
    public options:Object = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: false,
        pageSelect: false
    };

    static $inject = ['$scope', 'AuthService', 'message'];

    constructor(private $scope: any, private AuthService: IAuthService, private message: MessageService) {

    }

    $onInit() {
        this.users = Array.from(new Array(10)).map(() => copy(this.credTempl));
        //this.users.push(copy(this.credTempl), copy(this.credTempl), copy(this.credTempl));
    }

    invite() {
        let users = this.users.filter(u => u.email && u.public.firstName && u.public.lastName);
        if (users && users.length > 0) {
            this.AuthService.inviteUsers(this.coach.connections.Athletes.groupId,users)
                .then((result)=>{
                    if(result.hasOwnProperty('resultArray') && result.resultArray.every(r => r.status === 'I' || r.status === 'A')) {
                        this.message.toastInfo('inviteSuccess');
                        this.onCancel();
                    }
                }, (error)=>{debugger;});
        }
    }
}

const AthleteInvitationComponent:IComponentOptions = {
    bindings: {
        coach: '<',
        onCancel: '&',
    },
    require: {
        //component: '^component'
    },
    controller: AthleteInvitationCtrl,
    template: require('./athlete-invitation.component.html') as string
};

export default AthleteInvitationComponent;