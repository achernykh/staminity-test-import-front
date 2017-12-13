import './periodization-mesocycle-dialog.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { FormMode } from "../../../application.interface";
import { IMesocycle, IPeriodizationScheme } from "@api/seasonPlanning";
import { PeriodizationService } from "@app/methodology/periodization/periodization.service";
import { IQuillConfig } from "@app/share/quill/quill.config";
import MessageService from "@app/core/message.service";
import { IRevisionResponse } from "@api/core";

class PeriodizationMesocycleDialogCtrl implements IComponentController {

    // bind
    data: IMesocycle;
    schemeId: number;
    mode: FormMode;
    onCancel: () => IPromise<void>;
    onSave: (response: {mode: FormMode, mesocycle: IMesocycle}) => IPromise<void>;

    // private
    private mesocycle: IMesocycle;
    private config: any = { // value: 700
        colors: [
            {
                code: 'red',
                value: '#D32F2F'
            },
            {
                code: 'pink',
                value: '#C2185B'
            },
            {
                code: 'purple',
                value: '#7B1FA2'
            },
            {
                code: 'deep-purple',
                value: '#512DA8'
            },
            {
                code: 'indigo',
                value: '#303F9F'
            },
            {
                code: 'blue',
                value: '#1976D2'
            },
            {
                code: 'cyan',
                value: '#0097A7'
            },
            {
                code: 'teal',
                value: '#00796B'
            },
            {
                code: 'green',
                value: '#388E3C'
            },
            {
                code: 'deep-orange',
                value: '#E64A19'
            },
            {
                code: 'brown',
                value: '#5D4037'
            },
            {
                code: 'grey',
                value: '#616161'
            }

        ]
    };


    // inject
    static $inject = ['PeriodizationService', 'quillConfig', 'message'];

    constructor (
        private periodizationService: PeriodizationService,
        private quillConf: IQuillConfig,
        private message: MessageService) {

    }

    $onInit() {
        this.mesocycle = Object.assign({}, this.data);
    }

    save (): void {
        debugger;
        if (this.mode === FormMode.Post) {
            this.periodizationService
                .postMesocycle(this.schemeId, this.mesocycle)
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        mesocycle: Object.assign(this.mesocycle, {
                            id: response.value.id,
                            revision: response.value.revision
                        })
                    }),
                    (error) => this.message.toastInfo(error));
        }

        if (this.mode === FormMode.Put) {
            this.periodizationService
                .putMesocycle(this.schemeId, this.mesocycle)
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        mesocycle: Object.assign(this.mesocycle, {
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

    getSelectedText (): string {
        return this.mesocycle.color ?
            this.config.colors.filter(c => c.value === this.mesocycle.color)[0].code :
            '';
    }

    setChangeMode (): void {
        this.mode = FormMode.Put;
    }


}

export const PeriodizationMesocycleDialogComponent:IComponentOptions = {
    bindings: {
        data: '<',
        schemeId: '<',
        mode: '<',
        onCancel: '&',
        onSave: '&'
    },
    controller: PeriodizationMesocycleDialogCtrl,
    template: require('./periodization-mesocycle-dialog.component.html') as string
};