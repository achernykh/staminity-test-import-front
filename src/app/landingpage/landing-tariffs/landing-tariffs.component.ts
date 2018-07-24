import {IComponentController, IComponentOptions, ILocationService, IPromise, IScope} from "angular";
import {StateService} from "@uirouter/angularjs";
import moment from "moment/min/moment-with-locales.js";
import "./landing-tariffs.component.scss";
import { landingTariffsData, landingTariffsConfig, LandingTariffsSettings } from "./landing-tariffs.constants";
import { SessionService, getUser } from "../../core/session/session.service";
import { saveUtmParams } from "../../share/location/utm.functions";
import DisplayService from "../../core/display.service";

interface TariffCalc {
    premium: boolean;
    athletes: number;
    coaches: number;
    proAthletes: number;
};

class LandingTariffsCtrl implements IComponentController {

    data: any;
    onEvent: (response: Object) => IPromise<void>;
    selectedTab: string = "month";

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

    private currency: string; // = landingTariffsConfig.defaultCurrency;
    private currencyNumber: number;

    static $inject = ["$scope", "$location", "$state", 'SessionService', 'DisplayService', 'tariffConfig'];

    constructor(
        private $scope: IScope,
        private $location: ILocationService,
        private $state: StateService,
        private session: SessionService,
        private displayService: DisplayService,
        private tariffConfig: LandingTariffsSettings) {

        saveUtmParams($location.search());
    }

    $onInit() {
        this.selectedTab = this.$location.search().tab || "month";
        this.getPrice();
    }

    getPrice(): void {
        this.displayService.getLngObservable().subscribe(lng => {
            this.displayService.getCurrency()
                .then(currency => {
                    this.currency = 'RUB'; // currency;
                    this.currencyNumber = this.tariffConfig.currencyNumber[this.currency];
                    this.premiumPriceByUser = this.price.filter((t) => t.name === "premium")[0].fee.subscription[currency].month;
                    this.premiumPriceByCoach = this.price.filter((t) => t.name === "coach")[0].fee.variable[currency].coachAthletes.premium;
                    this.coachByUser = this.price.filter((t) => t.name === "coach")[0].fee.subscription[currency].month;
                    this.athleteByCoach = this.price.filter((t) => t.name === "coach")[0].fee.variable[currency].coachAthletes.athlete;
                }, e => console.error(e))
                .then(_ => this.$scope.$applyAsync());
        });
    }


    onChangeTab(tab: string): void {
        this.selectedTab = tab;
    }

    getVariableIconPath(variable: Object): string {
        const path: string = "/assets/icon";
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

    getAthletePriceLimit(): {athletes: number} {
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

    calculate(): number {
        return  this.calculateSubscription() + this.calculateVariable();
    }

    calculateSubscription(): number {
        return  (this.calc.premium && this.premiumPriceByUser) +
                (this.calc.coaches && this.calc.coaches * this.coachByUser);
    }

    calculateVariable(): number {
        return  Math.max(0, this.calc.athletes - this.calc.coaches) * this.athleteByCoach +
                this.calc.proAthletes * this.premiumPriceByCoach; ;

    }
}

const LandingTariffsComponent: IComponentOptions = {
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
