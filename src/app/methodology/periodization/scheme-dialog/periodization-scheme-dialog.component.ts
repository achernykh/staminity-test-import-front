import './periodization-scheme-dialog.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { FormMode } from "../../../application.interface";
import { IPeriodizationScheme } from "@api/seasonPlanning";
import { PeriodizationService } from "@app/methodology/periodization/periodization.service";
import { IQuillConfig } from "@app/share/quill/quill.config";
import MessageService from "@app/core/message.service";
import { IRevisionResponse } from "@api/core";

class PeriodizationSchemeDialogCtrl implements IComponentController {

    // bind
    data: IPeriodizationScheme;
    mode: FormMode;
    onCancel: () => IPromise<void>;
    onSave: (response: {mode: FormMode, scheme: IPeriodizationScheme}) => IPromise<void>;

    // private
    private scheme: IPeriodizationScheme;

    // inject
    static $inject = ['PeriodizationService', 'quillConfig', 'message'];

    constructor (
        private periodizationService: PeriodizationService,
        private quillConf: IQuillConfig,
        private message: MessageService) {

    }

    $onInit() {
        this.scheme = Object.assign({},
            this.data,
            {isSystem: this.data.hasOwnProperty('isSystem') && this.data.isSystem || false},
            {mesocycles: this.data.hasOwnProperty('mesocycles') && this.data.mesocycles || []});
    }

    save (): void {
        if (this.mode === FormMode.Post) {
            this.periodizationService
                .post(this.scheme)
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        scheme: Object.assign(this.scheme, {
                            id: response.value.id,
                            revision: response.value.revision
                        })
                    }),
                    (error) => this.message.toastInfo(error));
        }

        if (this.mode === FormMode.Put) {
            this.periodizationService
                .put(this.scheme)
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        scheme: Object.assign(this.scheme, {
                            id: response.value.id,
                            revision: response.value.revision
                        })
                    }),
                    (error) => this.message.toastInfo(error));
        }
    }


    get isViewMode (): boolean {
        return this.mode === FormMode.View;
    }

    setChangeMode (): void {
        this.mode = FormMode.Put;
    }
}

export const PeriodizationSchemeDialogComponent:IComponentOptions = {
    bindings: {
        data: '<',
        mode: '<',
        onCancel: '&',
        onSave: '&'
    },
    controller: PeriodizationSchemeDialogCtrl,
    template: require('./periodization-scheme-dialog.component.html') as string
};