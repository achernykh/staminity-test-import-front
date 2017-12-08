import './periodization-scheme-filter.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { IPeriodizationScheme } from "@api/seasonPlanning";
import { PeriodizationDialogService } from "./periodization-dialog.service";
import { FormMode } from "../../application.interface";
import { PeriodizationService } from "@app/methodology/periodization/periodization.service";
import MessageService from "@app/core/message.service";

class PeriodizationSchemeFilterCtrl implements IComponentController {

    // bind
    schemes: Array<IPeriodizationScheme>;
    onSelect: (response: {scheme: IPeriodizationScheme}) => IPromise<void>;

    // inject
    static $inject = ['message', 'PeriodizationService', 'PeriodizationDialogService'];

    constructor (
        private message: MessageService,
        private periodizationService: PeriodizationService,
        private periodizationDialogScheme: PeriodizationDialogService) {

    }

    $onInit() {

    }

    post (env: Event): void {
        this.periodizationDialogScheme.scheme(env, FormMode.Post)
            .then(result =>
                result.mode === FormMode.Post && this.schemes.push(result.scheme));
    }

    open (env: Event, scheme: IPeriodizationScheme): void {
        this.periodizationDialogScheme.scheme(env, FormMode.Put, scheme)
            .then(result => scheme = result.scheme);
    }

    delete (scheme: IPeriodizationScheme): void {
        this.periodizationService.delete(scheme)
            .then(response => this.message.toastInfo('methodology.periodization.scheme.deleted'),
                error => this.message.toastError(error));
    }

    openMenu ($mdMenu, ev) {
        $mdMenu.open(ev);
    }

}

export const PeriodizationSchemeFilterComponent:IComponentOptions = {
    bindings: {
        schemes: '<',
        onSelect: '&'
    },
    controller: PeriodizationSchemeFilterCtrl,
    template: require('./periodization-scheme-filter.component.html') as string
};
