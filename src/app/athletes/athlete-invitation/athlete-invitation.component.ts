import './athlete-invitation.component.scss';
import {IComponentOptions, IComponentController, IPromise, copy} from 'angular';

interface UserCredentials {
    public: {
        firstName: string;
        lastName: string;
        avatar: string;
        background: string;
    };
    display: {
        units: string;
        firstDayOfWeek: number;
        timezone: string;
        language: string;
    };
    email: string;
    password: string;
    activateCoachTrial: boolean;
    activatePremiumTrial: boolean;
};

class AthleteInvitationCtrl implements IComponentController {

    public data: any;
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

    static $inject = ['$scope'];

    constructor(private $scope: any) {

    }

    $onInit() {
        this.users = Array.from(new Array(10)).map(() => copy(this.credTempl));
        //this.users.push(copy(this.credTempl), copy(this.credTempl), copy(this.credTempl));
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