import './periodization-scheme-list.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { IPeriodizationScheme, IMesocycle } from "@api/seasonPlanning";
import { PeriodizationDialogService } from "../periodization-dialog.service";
import { FormMode } from "../../../application.interface";
import { PeriodizationService } from "@app/methodology/periodization/periodization.service";
import MessageService from "@app/core/message.service";
import { IQuillConfig } from "../../../share/quill/quill.config";

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

    /**
     * Диалог создания Мезоцикла
     * @param env
     */
    post (env: Event): void {
        this.periodizationDialogScheme.mesocycle(env, FormMode.Post, this.scheme.id)
            .then(result => this.scheme.mesocycles.push(result.mesocycle));
    }

    /**
     * Диалог изменения Мезоцикла
     * @param env
     * @param mesocycle
     */
    open (env: Event, mesocycle: IMesocycle): void {
        this.periodizationDialogScheme.mesocycle(env, FormMode.Put, this.scheme.id, mesocycle)
            .then(response => this.splice(response.mesocycle.id, response.mesocycle));
    }

    /**
     * Запрос удаления Мезоцикла
     * @param mesocycle
     */
    delete (mesocycle: IMesocycle): void {
        this.periodizationService.deleteMesocycle(this.scheme.id, mesocycle.id)
            .then(response => this.message.toastInfo('methodology.periodization.mesocycle.deleted'),
                error => this.message.toastError(error))
            .then(() => this.splice(mesocycle.id));
    }

    /**
     * Удаление или замена элемента в списке схем
     * @param id - номер схемы
     * @param scheme - схема для замены
     */
    private splice (id: number, mesocycle: IMesocycle = null): void {
        this.scheme.mesocycles
            .splice(this.scheme.mesocycles.findIndex(s => s.id === id), 1, mesocycle);
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