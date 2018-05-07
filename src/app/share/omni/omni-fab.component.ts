import './omni-fab.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { OmniService } from "./omni.service";
import MessageService from "../../core/message.service";

class OmniFabCtrl implements IComponentController {
    
    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;
     
    // private
   
    // inject
    static $inject = ['OmniService', 'message'];

    constructor(private omni: OmniService, private message: MessageService) {

    }

    $onInit(): void {}

    open (e: Event) { this.omni.open(e)
        .then(_ => this.message.toastInfo('omniMessagePost'), e => this.message.toastError('omniMessagePostError'));
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