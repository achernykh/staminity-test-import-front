import "./calendar-item-competition.component.scss";
import { IComponentOptions, IComponentController, INgModelController } from "angular";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { ICalendarItemDialogOptions, ICalendarItemDialogResponse } from "../calendar-item-dialog.interface";
import { CalendarItemCompetition } from "./calendar-item-competition.datamodel";
import { ICompetitionConfig } from "./calendar-item-competition.config";
import { CalendarService } from "../../calendar/calendar.service";
import MessageService from "../../core/message.service";
import { IQuillConfig } from "../../share/quill/quill.config";
import { FormMode } from "../../application.interface";
import { IRevisionResponse } from "../../../../api/core/core";
;

export class CalendarItemCompetitionCtrl implements IComponentController {

    // bind
    item: ICalendarItem;
    options: ICalendarItemDialogOptions;
    onAnswer: (response: ICalendarItemDialogResponse) => Promise<void>;
    onCancel: () => Promise<void>;

    // private
    private form: INgModelController;
    private competition: CalendarItemCompetition;

    // inject
    static $inject = ['CompetitionConfig', 'CalendarService', 'message', 'quillConfig'];

    constructor (private config: ICompetitionConfig,
                 private calendarService: CalendarService,
                 private message: MessageService,
                 private quillConf: IQuillConfig) {

    }

    $onInit () {
        this.competition = new CalendarItemCompetition(this.item, this.options);
        if ( this.options.formMode === FormMode.Post &&
            this.competition.competitionHeader.type && this.competition.competitionHeader ) {
            this.setDistanceType();
        }
    }

    setType (): void {
        this.competition.competitionHeader.distanceType = null;
        this.clearItems();
    }

    setDistanceType (): void {
        this.clearItems();
        this.competition.setItems(
            this.config.types[this.competition.competitionHeader.type][this.competition.competitionHeader.distanceType]);
    }

    /**
     * Удаляем этапы соревнования
     * Если этапы уже были сохранены, то удаляем соответствующие тренировки
     */
    clearItems (): void {
        debugger;
        if ( !this.competition.view.isPost && this.competition.calendarItemId ) {
            this.calendarService
                .deleteItem('F', this.competition.items.filter(i => i.item.calendarItemId).map(i => i.item.calendarItemId))
                .then(response => {debugger;})
                .then(() => this.competition.items = []);
        } else {
            this.competition.items = [];
        }

    }

    check (): void {
        this.form.$setValidity('needStage', this.competition.items && this.competition.items.length > 0);
    }

    setDirty (): void {
        this.form.$setDirty();
    }

    save () {
        if ( this.competition.view.isPost ) {
            this.calendarService.postItem(this.competition.build())
                .then(response => this.competition.compile(response),
                    error => {
                        this.message.toastError(error);
                        throw new Error(error);
                    })
                .then(() => this.competition.setParentId())
                .then(() => this.saveItems())
                .then(
                    response => {
                        this.message.toastInfo('competitionCreated');
                        this.onAnswer({ formMode: FormMode.Post, item: this.competition.build() });
                    },
                    error => {debugger;}
                );
        }

        if ( this.competition.view.isPut ) {
            this.calendarService.putItem(this.competition.build())
                .then(response => this.competition.compile(response),
                    error => {
                        this.message.toastError(error);
                        throw new Error(error);
                    })
                .then(() => this.saveItems())
                .then(() => {
                    this.message.toastInfo('competitionModified');
                    this.onAnswer({ formMode: FormMode.Put, item: this.competition.build() });
                });
        }
    }

    delete (): void {
        this.calendarService.deleteItem('F', [this.competition.calendarItemId])
            .then(() => {
                this.message.toastInfo('competitionDeleted');
                this.onAnswer({ formMode: FormMode.Delete, item: this.competition.build() });
            }, error => this.message.toastError(error));
    }

    saveItems (): Promise<Array<IRevisionResponse>> {
        return Promise.all(<any>this.competition.items.map(i => {
                if ( this.competition.view.isPost ) {
                    return this.calendarService.postItem(i.item.build());
                }
                if ( this.competition.view.isPut && i.dirty) {
                    return this.calendarService.putItem(i.item.build());
                }
            })
        );
    }

    private close (): void {
        this.onCancel();
    }
}

export const CalendarItemCompetitionComponent: IComponentOptions = {
    bindings: {
        item: '<',
        options: '<',
        onAnswer: '&',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CalendarItemCompetitionCtrl,
    template: require('./calendar-item-competition.component.html') as string
};