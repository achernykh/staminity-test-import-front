import './periodization-scheme-list.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { IPeriodizationScheme, IMesocycle } from "@api/seasonPlanning";
import { PeriodizationDialogService } from "./periodization-dialog.service";
import { FormMode } from "../../application.interface";
import { PeriodizationService } from "@app/methodology/periodization/periodization.service";
import MessageService from "@app/core/message.service";
import { IQuillConfig } from "../../share/quill/quill.config";

class PeriodizationSchemeListCtrl implements IComponentController {

    // bind
    scheme: IPeriodizationScheme;
    onEvent: (response: Object) => IPromise<void>;

    // inject
    static $inject = ['message', 'PeriodizationService', 'PeriodizationDialogService', 'quillConfig'];

    constructor (
        private message: MessageService,
        private periodizationService: PeriodizationService,
        private periodizationDialogScheme: PeriodizationDialogService, private quillConfig: IQuillConfig) {

    }

    $onInit() {

    }

    post (env: Event): void {
        this.periodizationDialogScheme.mesocycle(env, FormMode.Post, this.scheme.id)
            .then(result =>
                result.mode === FormMode.Post && this.scheme.mesocycles.push(result.mesocycle));
    }

    open (env: Event, mesocycle: IMesocycle): void {
        this.periodizationDialogScheme.mesocycle(env, FormMode.Put, this.scheme.id, mesocycle)
            .then(result => mesocycle = result.mesocycle);
    }

    delete (mesocycle: IMesocycle): void {
        this.periodizationService.deleteMesocycle(this.scheme.id, mesocycle.id)
            .then(response => this.message.toastInfo('methodology.periodization.mesocycle.deleted'),
                error => this.message.toastError(error));
    }


    openMenu ($mdMenu, ev) {
        $mdMenu.open(ev);
    }

}

export const PeriodizationSchemeListComponent:IComponentOptions = {
    bindings: {
        scheme: '<',
        onEvent: '&'
    },
    controller: PeriodizationSchemeListCtrl,
    template: require('./periodization-scheme-list.component.html') as string
};