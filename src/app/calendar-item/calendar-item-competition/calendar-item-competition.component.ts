import "./calendar-item-competition.component.scss";
import { IComponentOptions, IComponentController, IPromise } from "angular";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { ICalendarItemDialogOptions, ICalendarItemDialogResponse } from "../calendar-item-dialog.interface";
import { CalendarItemCompetition } from "./calendar-item-competition.datamodel";
import { ICompetitionConfig } from "./calendar-item-competition.config";
import { CalendarService } from "../../calendar/calendar.service";
import MessageService from "../../core/message.service";
import { IQuillConfig } from "../../share/quill/quill.config";
import { FormMode } from "../../application.interface";

export class CalendarItemCompetitionCtrl implements IComponentController {

    // bind
    item: ICalendarItem;
    options: ICalendarItemDialogOptions;
    onAnswer: (response: ICalendarItemDialogResponse) => IPromise<void>;
    onCancel: () => Promise<void>;

    // private
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

    setDistanceType (): void {
        this.competition.setItems(
            this.config.types[this.competition.competitionHeader.type][this.competition.competitionHeader.distanceType]);
    }

    save () {
        if ( this.competition.view.isPost ) {

            this.calendarService.postItem(this.competition.build())
                .then(
                    response => {
                        this.competition.compile(response);// сохраняем id, revision в обьекте
                    },
                    error => {
                        this.message.toastError(error);
                        throw new Error(error);
                    })
                .then(() => this.competition.setParentId())
                .then(() => this.saveItems())
                .then(
                    response => {
                        debugger;
                        this.message.toastInfo('competitionCreated');
                        this.onAnswer({ formMode: FormMode.Put, item: this.competition.build() });
                    },
                    error => {debugger;}
                );
        }

        if ( this.competition.view.isPut ) {

        }
    }

    delete (): void {
        this.calendarService.deleteItem('F', [this.competition.calendarItemId])
            .then(() => {
                this.message.toastInfo('competitionDeleted');
                this.onAnswer({ formMode: FormMode.Delete, item: this.competition.build() });
            }, error => this.message.toastError(error));
    }

    saveItems (): Promise<any> {
        let tasks: Array<Promise<any>> = [];

        this.competition.items.map(i => {
            switch ( i.mode ) {
                case FormMode.Post: {
                    return tasks.push(this.calendarService.postItem(i.item.build()));
                }
            }
        });

        return Promise.all(tasks);
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