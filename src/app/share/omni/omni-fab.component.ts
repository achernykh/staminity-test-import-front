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
    private content: Element;
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
            this.content = document.querySelector('.landing-main__welcome');
            this.content.addEventListener('scroll', () => {
                this.fab.addClass(this.content.scrollTop > window.innerHeight * 0.05 ? 'show' : 'hide');
                this.fab.removeClass(this.content.scrollTop <= window.innerHeight * 0.05 ? 'show' : 'hide');
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