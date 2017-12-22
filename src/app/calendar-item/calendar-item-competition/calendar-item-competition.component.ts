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
import { CalendarItemDialogService } from "@app/calendar-item/calendar-item-dialog.service";
import { Activity } from "../../activity/activity-datamodel/activity.datamodel";

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
    static $inject = ['CompetitionConfig', 'CalendarService', 'CalendarItemDialogService', 'message', 'quillConfig', 'dialogs'];

    constructor (private config: ICompetitionConfig,
                 private calendarService: CalendarService,
                 private calendarDialog: CalendarItemDialogService,
                 private message: MessageService,
                 private quillConf: IQuillConfig,
                 private dialogs: any) {

    }

    $onInit () {
        this.competition = new CalendarItemCompetition(this.item, this.options);
    }

    /**
     * Диалог просмотра Соревнования
     * @param e
     */
    open (e: Event): void {
        this.calendarDialog.competition(e, Object.assign(this.options, {formMode: FormMode.View}), this.competition)
            .then(response => this.onAnswer(response));
    }

    edit (e: Event): void {
        this.calendarDialog.competition(e, Object.assign(this.options, {formMode: FormMode.Put}), this.competition)
            .then(response => this.onAnswer(response));
    }

    setDate (): void {
        debugger;
        if (this.competition.items) {
            //////this.competition.setDate();
        }


    }


    setType (): void {
        this.competition.competitionHeader.distanceType = null;
        this.clearItems();
        this.check();
    }

    setDistanceType (): void {
        this.clearItems();
        this.competition.setItems(this.config.distanceTypes.filter(t =>
            t.type === this.competition.competitionHeader.type &&
            t.code === this.competition.competitionHeader.distanceType)[0].stages);
        this.check();
                //[this.competition.competitionHeader.type]
                //[this.competition.competitionHeader.distanceType]);
    }

    /**
     * Удаляем этапы соревнования
     * Если этапы уже были сохранены, то удаляем соответствующие тренировки
     */
    clearItems (): void {
        if ( !this.competition.view.isPost && this.competition.calendarItemId && this.competition.items) {
            this.calendarService
                .deleteItem('F', this.competition.items.filter(i => i.item.calendarItemId).map(i => i.item.calendarItemId))
                .then(response => {});
                //.then(() => this.competition.items = []);
        } else {
            this.competition.items = [];
        }
    }

    check (): void {
        this.form.$setValidity('needStage', this.competition.items && this.competition.items.length > 0);
        //this.form.$setValidity('needDuration', this.competition.items && this.competition.items.every(i => i.item.durationValue));
    }

    setDirty (): void {
        this.form.$setDirty();
        this.check();
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
                .then(() => this.onAnswer({
                    formMode: FormMode.Post,
                    item: Object.assign(this.competition, {calendarItems: this.competition.items.map(i => i.item.build())})
                }))
                .then(() => this.saveItems())
                .then(() => {
                        this.message.toastInfo('competitionCreated');
                        this.onCancel();
                    },
                    error => {}
                );
        }

        if ( this.competition.view.isPut ) {
            this.calendarService.putItem(this.competition.build())
                .then(response => this.competition.compile(response),
                    error => {
                        this.message.toastError(error);
                        throw new Error(error);
                    })
                .then(() => Object.assign(this.competition, {calendarItems: this.competition.items.map(i => i.item.build())}))
                .then(competition => this.onAnswer({ formMode: FormMode.Put, item: competition }))
                .then(() => this.saveItems())
                .then(() => {
                    this.message.toastInfo('competitionModified');
                    this.onCancel();
                    //this.onAnswer({ formMode: FormMode.Put, item: this.competition });
                });
        }
    }

    delete (): void {
        Promise.resolve(() => {})
            .then(() => this.competition.isCompleted && this.dialogs.confirm({text: 'dialogs.deleteActualCompetition'}))
            .then(() => this.calendarService.deleteItem('F', [this.competition.calendarItemId]))
            .then(() => {
                this.message.toastInfo('competitionDeleted');
                this.onAnswer({ formMode: FormMode.Delete, item: this.competition.build() });
            }, error => error && this.message.toastError(error));
    }

    saveItems (): Promise<Array<IRevisionResponse>> {
        debugger;
        return Promise.all(<any>this.competition.items.map(i => {
                i.item = new Activity(i.item.build(), this.options);
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