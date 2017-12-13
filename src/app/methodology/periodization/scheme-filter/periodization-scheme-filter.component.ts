import './periodization-scheme-filter.component.scss';
import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IPeriodizationScheme } from "@api/seasonPlanning";
import { PeriodizationDialogService } from "../periodization-dialog.service";
import { FormMode } from "../../../application.interface";
import { PeriodizationService } from "@app/methodology/periodization/periodization.service";
import MessageService from "@app/core/message.service";

class PeriodizationSchemeFilterCtrl implements IComponentController {

    // bind
    schemes: Array<IPeriodizationScheme>;
    onSelect: (response: { scheme: IPeriodizationScheme }) => IPromise<void>;

    // inject
    static $inject = [ 'message', 'PeriodizationService', 'PeriodizationDialogService' ];

    constructor (private message: MessageService,
                 private periodizationService: PeriodizationService,
                 private periodizationDialogScheme: PeriodizationDialogService) {

    }

    $onInit () {

    }

    /**
     * Диалого создания Схемы
     * @param env
     */
    post (env: Event): void {
        this.periodizationDialogScheme.scheme(env, FormMode.Post)
            .then(result => {
                this.schemes.push(result.scheme);
                this.onSelect({ scheme: result.scheme });
            });
    }

    /**
     * Диалог изменения Схемы
     * @param env
     * @param scheme
     */
    edit (env: Event, scheme: IPeriodizationScheme): void {
        this.periodizationDialogScheme.scheme(env, FormMode.Put, scheme)
            .then(response => this.splice(response.scheme.id, response.scheme));
    }

    /**
     * Запрос удаления схемы
     * @param scheme
     */
    delete (scheme: IPeriodizationScheme): void {
        this.periodizationService.delete(scheme)
            .then(response => this.message.toastInfo('methodology.periodization.scheme.deleted'),
                error => this.message.toastError(error))
            .then(() => this.splice(scheme.id));
    }

    /**
     * Удаление или замена элемента в списке схем
     * @param id - номер схемы
     * @param scheme - схема для замены
     */
    private splice (id: number, scheme: IPeriodizationScheme = null): void {
        this.schemes.splice(this.schemes.findIndex(s => s.id === id), 1, scheme);
    }

    openMenu ($mdMenu, ev) {
        $mdMenu.open(ev);
    }

}

export const PeriodizationSchemeFilterComponent: IComponentOptions = {
    bindings: {
        schemes: '<',
        active: '<', // активная-выделенная схема
        onSelect: '&'
    },
    controller: PeriodizationSchemeFilterCtrl,
    template: require('./periodization-scheme-filter.component.html') as string
};
