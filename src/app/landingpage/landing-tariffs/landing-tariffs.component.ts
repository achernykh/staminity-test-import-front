import './landing-tariffs.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {landingTariffsData} from "./landing-tariffs.constants";

class LandingTariffsCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;

    private readonly price = landingTariffsData;
    private readonly country: string = 'ru';

    static $inject = [];

    constructor() {

    }

    $onInit() {

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