import {IComponentController, IComponentOptions, ILocationService,IPromise,IScope} from "angular";
import {StateService} from "angular-ui-router";
import moment from "moment/min/moment-with-locales.js";
import "./landing-tariffs.component.scss";
import {landingTariffsData} from "./landing-tariffs.constants";

interface TariffCalc {
    premium: boolean;
    athletes: number;
    coaches: number;
    proAthletes: number;
};

class LandingTariffsCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    public selectedTab: string = "month";


    private calc: TariffCalc = {
        premium: false,
        athletes: 5,
        coaches: 1,
        proAthletes: 0,
    };

    private readonly price = landingTariffsData;
    private premiumPriceByUser: number;
    private premiumPriceByCoach: number;
    private coachByUser: number;
    private athleteByCoach: number;

    private readonly country: string = "ru";

    static $inject = ["$scope","$location","$state"];

    constructor(
        private $scope: IScope,
        private $location: ILocationService,
        private $state: StateService) {

    }

    $onInit() {
        this.selectedTab = this.$location.search().tab || "month";
        /**if(this.selectedTab === 'calculator') {
            Object.assign(this.calc, this.$location.search());
            this.$scope.$apply();
        }**/

        this.premiumPriceByUser = this.price.filter((t) => t.name === "premium")[0].fee.subscription[this.country].month;
        this.premiumPriceByCoach = this.price.filter((t) => t.name === "coach")[0].fee.variable[this.country].coachAthletes.premium;
        this.coachByUser = this.price.filter((t) => t.name === "coach")[0].fee.subscription[this.country].month;
        this.athleteByCoach = this.price.filter((t) => t.name === "coach")[0].fee.variable[this.country].coachAthletes.athlete;
    }

    onChangeTab(tab: string):void{
        this.selectedTab = tab;
    }

    getVariableIconPath(variable: Object): string {
        let path: string = "/assets/icon";
        return variable.hasOwnProperty("coachAthletes") && `${path}/variable_athlete.svg` ||
            variable.hasOwnProperty("clubAthletes") && `${path}/variable_athlete_coach.svg`;
    }

    getVariableIconSize(variable: Object): string {
        return variable.hasOwnProperty("coachAthletes") && "width: 32px; height: 32px" ||
            variable.hasOwnProperty("clubAthletes") && "width: 38px; height: 32px";
    }

    getVariableType(rule: string): string {
        return rule.search("Athlete") !== -1 ? "person_outline" : "person";
    }

    getAthletePriceLimit():{athletes: number} {
        return ({
            athletes: this.calc.coaches * 10,
        });
    }

    onCoachChange(): void {
        this.calc.athletes = Math.min(this.calc.athletes, this.calc.coaches * 10);
        //this.calc.athletes = Math.max(this.calc.athletes, this.calc.coaches);
    }

    onAthleteChange(): void {
        this.calc.proAthletes = Math.min(this.calc.proAthletes, this.calc.athletes);
    }

    calculate():number {
        return  this.calculateSubscription() + this.calculateVariable();
    }

    calculateSubscription():number {
        return  (this.calc.premium && this.premiumPriceByUser) +
                (this.calc.coaches && this.calc.coaches * this.coachByUser);
    }

    calculateVariable():number {
        return  Math.max(0, this.calc.athletes - this.calc.coaches) * this.athleteByCoach +
                this.calc.proAthletes * this.premiumPriceByCoach;;

    }
}

const LandingTariffsComponent:IComponentOptions = {
    bindings: {
        data: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: LandingTariffsCtrl,
    template: require("./landing-tariffs.component.html") as string,
};

export default LandingTariffsComponent;