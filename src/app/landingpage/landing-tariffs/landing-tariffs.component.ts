import './landing-tariffs.component.scss';
import {IComponentOptions, IComponentController, IPromise,ILocationService} from 'angular';
import {landingTariffsData} from "./landing-tariffs.constants";
import moment from 'moment/min/moment-with-locales.js';

class LandingTariffsCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    public selectedTab: string = 'month';


    private readonly price = landingTariffsData;
    private readonly country: string = 'ru';

    static $inject = ['$location'];

    constructor(private $location: ILocationService) {

    }

    $onInit() {
        moment.locale('ru');
        this.selectedTab = this.$location.search().tab || 'month';
    }

    onChangeTab(tab: string):void{
        this.selectedTab = tab;
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