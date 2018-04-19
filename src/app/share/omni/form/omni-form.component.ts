import './omni-form.component.scss';
import {IComponentOptions, IComponentController, INgModelController} from 'angular';
import { IQuillConfig } from "../../quill/quill.config";
import { IWSRequest } from "../../../core/socket/socket.interface";

export class OmniMessageRequest implements IWSRequest {
    requestType: string;
    requestData: OmniMessage;

    constructor (message: OmniMessage) {
        this.requestType = 'omniMessage';
        this.requestData = message;
    }
}

export interface OmniMessage {
    user_email: string;
    user_full_name: string;
    subject: string;
    language_id: number;
    content_html: string;
    note: {
        content: string;
        files: [
            {
                name: string;
                ext: string;
                content: any;
            }
        ];
    }
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