import {IComponentController, IComponentOptions, IPromise} from "angular";
import {IUserProfile} from "../../../../api/user/user.interface";
import {DashboardCtrl} from "../dashboard.component";
import "./dashboard-athlete.component.scss";

class DashboardAthleteCtrl implements IComponentController {

    public profile: IUserProfile;
    public dashboard: DashboardCtrl;
    public onSelect: (response: Object) => IPromise<void>;

    private selected: boolean = null;

    public static $inject = ["$state"];

    constructor(private $state: any, private $mdDialog: any) {

    }

    public $onInit() {
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
