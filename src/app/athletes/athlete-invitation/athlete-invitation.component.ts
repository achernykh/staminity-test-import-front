import {copy, IComponentController, IComponentOptions, IPromise} from "angular";
import {UserCredentials} from "../../../../api/auth/auth.request";
import {IUserProfile} from "../../../../api/user/user.interface";
import AuthService from "../../auth/auth.service";
import {IAuthService} from "../../auth/auth.service";
import MessageService from "../../core/message.service";
import "./athlete-invitation.component.scss";

class AthleteInvitationCtrl implements IComponentController {

    groupId: number;
    onEvent: (response: Object) => IPromise<void>;
    onCancel: () => IPromise<void>;

    private credTempl: UserCredentials = {
        public: {
            firstName: "",
            lastName: "",
            avatar: "default.jpg",
            background: "default.jpg",
        },
        display: {
            units: "metric",
            firstDayOfWeek: 1,
            timezone: "Europe/Moscow",
            language: "ru",
        },
        email: "",
        password: "",
        activateCoachTrial: false,
        activatePremiumTrial: true,
    };
    private users: UserCredentials[] = [];
    options: Object = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: false,
        pageSelect: false,
    };

    static $inject = ["$scope", "AuthService", "message"];

    constructor(private $scope: any, private AuthService: IAuthService, private message: MessageService) {

    }

    $onInit() {
        this.users = Array.from(new Array(10)).map(() => copy(this.credTempl));
        //this.users.push(copy(this.credTempl), copy(this.credTempl), copy(this.credTempl));
    }

    invite() {
        const users = this.users.filter((u) => u.email && u.public.firstName && u.public.lastName);
        if (users && users.length > 0) {
            this.AuthService.inviteUsers(this.groupId, users)
                .then((result) => {
                    if (result.hasOwnProperty("resultArray") && result.resultArray.every((r) => r.status === "I" || r.status === "A")) {
                        this.message.toastInfo("inviteSuccess");
                        this.onCancel();
                    }
                }, (error) => {});
        }
    }
}

const AthleteInvitationComponent: IComponentOptions = {
    bindings: {
        groupId: "<",
        onCancel: "&",
    },
    require: {
        //component: '^component'
    },
    controller: AthleteInvitationCtrl,
    template: require("./athlete-invitation.component.html") as string,
};

export default AthleteInvitationComponent;
