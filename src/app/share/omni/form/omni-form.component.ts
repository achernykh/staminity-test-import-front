import './omni-form.component.scss';
import {IComponentOptions, IComponentController, INgModelController} from 'angular';
import { IQuillConfig } from "../../quill/quill.config";

export interface OmniMessage {
    user_email: string,
    user_full_name: string,
    subject: string,
    content_html: string
}

class OmniFormCtrl implements IComponentController {

    // bind
    data: any;
    onCancel: () => Promise<void>;
    onPost: (response: Object) => Promise<void>;

    // private
    private omniForm: INgModelController;
    private message : OmniMessage;

    // inject
    static $inject = ['quillConfig'];

    constructor(private quillConf: IQuillConfig,) {

    }

    $onInit(): void {

    }
}

export const OmniFormComponent:IComponentOptions = {
    bindings: {
        message: '<',
        onCancel: '&',
        onPost: '&'
    },
    controller: OmniFormCtrl,
    template: require('./omni-form.component.html') as string
};