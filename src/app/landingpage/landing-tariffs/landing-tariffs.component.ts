import './landing-tariffs.component.scss';
import {IComponentOptions, IComponentController, IPromise,ILocationService,IScope} from 'angular';
import {landingTariffsData} from "./landing-tariffs.constants";
import moment from 'moment/min/moment-with-locales.js';
import {StateService} from 'angular-ui-router';

interface TariffCalc {
    premium: boolean;
    athletes: number;
    coaches: number;
    proAthletes: number;
};

class LandingTariffsCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    public selectedTab: string = 'month';


    private calc: TariffCalc = {
        premium: false,
        athletes: 1,
        coaches: 1,
        proAthletes: 0
    };

    private readonly price = landingTariffsData;
    private premiumPriceByUser: number;
    private premiumPriceByCoach: number;
    private coachByUser: number;
    private athleteByCoach: number;

    private readonly country: string = 'ru';

    static $inject = ['$scope','$location','$state'];

    constructor(
        private $scope: IScope,
        private $location: ILocationService,
        private $state: StateService) {

    }

    $onInit() {
        moment.locale('ru');
        this.selectedTab = this.$location.search().tab || 'month';
        /**if(this.selectedTab === 'calculator') {
            Object.assign(this.calc, this.$location.search());
            this.$scope.$apply();
        }**/

        this.premiumPriceByUser = this.price.filter(t => t.name === 'premium')[0].fee.subscription[this.country].month;
        this.premiumPriceByCoach = this.price.filter(t => t.name === 'coach')[0].fee.variable[this.country].coachAthletes.premium;
        this.coachByUser = this.price.filter(t => t.name === 'coach')[0].fee.subscription[this.country].month;
        this.athleteByCoach = this.price.filter(t => t.name === 'coach')[0].fee.variable[this.country].coachAthletes.athlete;
    }

    onChangeTab(tab: string):void{
        this.selectedTab = tab;
    }

    getAthletePriceLimit():{athletes: number} {
        return ({
            athletes: this.calc.coaches * 10
        });
    }

    onCoachChange(): void {
        this.calc.athletes = Math.min(this.calc.athletes, this.calc.coaches * 10);//this.calc.coaches * 10 > this.calc.athletes ? this.calc.coaches * 10 : this.calc.athletes;
    }

    calculate():number {
        return  this.calculateSubscription() + this.calculateVariable();
    }

    calculateSubscription():number {
        return  (this.calc.premium && this.premiumPriceByUser) +
                (this.calc.coaches && this.calc.coaches * this.coachByUser);
    }

    calculateVariable():number {
        return  Math.max(0, this.calc.athletes - 1) * this.athleteByCoach +
                this.calc.proAthletes * this.premiumPriceByCoach;;

    }
}

const LandingTariffsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: LandingTariffsCtrl,
    template: require('./landing-tariffs.component.html') as string
};

export default LandingTariffsComponent;