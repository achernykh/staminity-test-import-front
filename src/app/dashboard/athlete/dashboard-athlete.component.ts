import {IComponentController, IComponentOptions, IPromise} from "angular";
import {IUserProfile} from "../../../../api/user/user.interface";
import {DashboardCtrl} from "../dashboard.component";
import "./dashboard-athlete.component.scss";

class DashboardAthleteCtrl implements IComponentController {

    profile: IUserProfile;
    dashboard: DashboardCtrl;
    onSelect: (response: Object) => IPromise<void>;

    private selected: boolean = null;

    static $inject = ["$state"];

    constructor(private $state: any, private $mdDialog: any) {

    }

    $onInit() {
        //this.selected = this.dashboard.selectedAthletes.indexOf(this.profile.userId) !== -1;
    }
}

const DashboardAthleteComponent: IComponentOptions = {
    bindings: {
        profile: "<",
        selected: "<",
        onSelect: "&",
    },
    require: {
        dashboard: "^dashboard",
    },
    controller: DashboardAthleteCtrl,
    template: require("./dashboard-athlete.component.html") as string,
};

export default DashboardAthleteComponent;
