import './omni-fab.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { OmniService } from "./omni.service";

class OmniFabCtrl implements IComponentController {
    
    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;
     
    // private
   
    // inject
    static $inject = ['OmniService'];

    constructor(private omni: OmniService) {

    }

    $onInit(): void {

    }

    open (e: Event) {
        this.omni.open(e).then(_ => {});
    }
}

export const OmniFabComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    controller: OmniFabCtrl,
    template: require('./omni-fab.component.html') as string
};