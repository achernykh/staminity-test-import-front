import './omni-fab.component.scss';
import {IComponentOptions, IComponentController, element} from 'angular';
import { OmniService } from "./omni.service";
import MessageService from "../../core/message.service";

class OmniFabCtrl implements IComponentController {
    
    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;
     
    // private
    private fab: JQuery;
    // inject
    static $inject = ['OmniService', 'message', '$document'];

    constructor(private omni: OmniService, private message: MessageService, private $document) {
        this.subscribeOnScroll();
    }

    $onInit(): void {}

    open (e: Event) { this.omni.open(e)
        .then(_ => this.message.toastInfo('omniMessagePost'), e => this.message.toastError('omniMessagePostError'));
    }

    subscribeOnScroll(): void {
        setTimeout(() => {
            this.fab = element(this.$document[0].querySelector('#omni-fab'));
            window.addEventListener('scroll', () => {
                this.fab.addClass(window.scrollY > window.innerHeight * 0.05 ? 'show' : 'hide');
                this.fab.removeClass(window.scrollY <= window.innerHeight * 0.05 ? 'show' : 'hide');
            });
        }, 100);
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