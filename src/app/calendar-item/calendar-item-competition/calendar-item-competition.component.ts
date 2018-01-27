import "./calendar-item-competition.component.scss";
import { IComponentOptions, IComponentController, INgModelController,IScope } from "angular";
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
import { TrainingPlansService } from "../../training-plans/training-plans.service";
import ReferenceService from "../../reference/reference.service";

export class CalendarItemCompetitionCtrl implements IComponentController {

    // bind
    index: number;
    item: ICalendarItem;
    options: ICalendarItemDialogOptions;
    onAnswer: (response: ICalendarItemDialogResponse) => Promise<void>;
    onCancel: () => Promise<void>;

    // private
    private form: INgModelController;
    private competition: CalendarItemCompetition;

    // inject
    static $inject = ['$scope','CompetitionConfig', 'ReferenceService', 'CalendarService', 'TrainingPlansService', 'CalendarItemDialogService', 'message', 'quillConfig', 'dialogs'];

    constructor (private $scope: IScope,
                 private config: ICompetitionConfig,
                 private referenceService: ReferenceService,
                 private calendarService: CalendarService,
                 private trainingPlansService: TrainingPlansService,
                 private calendarDialog: CalendarItemDialogService,
                 private message: MessageService,
                 private quillConf: IQuillConfig,
                 private dialogs: any) {

    }

    $onInit () {
        this.competition = new CalendarItemCompetition(this.item, this.options);
    }

    $onChanges (changes): void {
        if (changes.hasOwnProperty('index') && !changes.index.isFirstChange() && this.item) {
            debugger;
            this.competition = new CalendarItemCompetition(this.item, this.options);
            //this.$scope.$applyAsync();
        }
    }

    /**
     * Диалог просмотра Соревнования
     * @param e
     */
    open (e: Event): void {
        this.calendarDialog.competition(e, Object.assign({}, this.options,
            {formMode: this.options.trainingPlanMode ? FormMode.Put : FormMode.View}), this.competition)
            .then(response => this.onAnswer(response));
    }

    edit (e: Event): void {
        this.calendarDialog.competition(e, Object.assign({} , this.options, {formMode: FormMode.Put}), this.competition)
            .then(response => this.onAnswer(response));
    }

    setDate (): void {
        if (this.competition.items) {
            //////this.competition.setDate();
        }


    }


    setType (): void {
        this.competition.competitionHeader.distanceType = null;
        this.clearItems();
        this.check();
    }

    get distanceType () : any {
        let { competitionHeader } = this.competition;
        return competitionHeader && this.config.distanceTypes.find((t) => t.type === competitionHeader.type && t.code === competitionHeader.distanceType);
    }

    set distanceType (distanceType: any) {
        this.clearItems();
        this.competition.competitionHeader.distanceType = distanceType.code;
        this.competition.setItems(distanceType.stages, this.referenceService.categories);
        this.check();
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
                    error => {this.message.toastError(error); throw new Error(error);})
                .then(() => this.competition.setParentId())
                .then(() => Object.assign({}, this.competition, {items: null, calendarItems: []}))
                .then(competition => this.onAnswer({ formMode: FormMode.Post, item: competition}))
                .then(() => this.saveItems())
                .then(() => { this.message.toastInfo('competitionCreated'); this.onCancel(); }, error => {});
        }

        if ( this.competition.view.isPut ) {
            this.calendarService.putItem(this.competition.build())
                .then(response => this.competition.compile(response),
                    error => { this.message.toastError(error); throw new Error(error);})
                .then(() => Object.assign({}, this.competition, {calendarItems: this.competition.items.map(i => i.item.build())}))
                .then(competition => this.onAnswer({ formMode: FormMode.Put, item: competition }))
                .then(() => this.saveItems())
                .then(() => { this.message.toastInfo('competitionModified'); this.onCancel();
                }, error => this.message.toastError(error));
        }
    }

    saveTrainingPlanCompetition () {
        if ( this.competition.view.isPost ) {
            this.trainingPlansService.postItem(this.options.trainingPlanOptions.planId, this.competition.build())
                .then(response => this.competition.compile(response),
                    error => { this.message.toastError(error); throw new Error(error); })
                .then(() => this.competition.setParentId())
                .then(() => this.onAnswer({
                    formMode: FormMode.Post,
                    item: Object.assign({}, this.competition, {items: null, calendarItems: [] /*calendarItems: this.competition.items.map(i => i.item.build())*/})
                }))
                .then(() => this.saveTrainingPlanItems())
                .then(() => {
                        this.message.toastInfo('competitionCreated');
                        this.onCancel();
                    }, error => this.message.toastError(error)
                );
        }
        if ( this.competition.view.isPut ) {
            this.trainingPlansService.putItem(this.options.trainingPlanOptions.planId, this.competition.build())
                .then(response => this.competition.compile(response),
                    error => { this.message.toastError(error); throw new Error(error); })
                .then(() => Object.assign({}, this.competition, {calendarItems: this.competition.items.map(i => i.item.build())}))
                .then(competition => this.onAnswer({ formMode: FormMode.Put, item: competition }))
                .then(() => this.saveTrainingPlanItems())
                .then(() => { this.message.toastInfo('competitionModified'); this.onCancel();},
                    error => this.message.toastError(error));
        }
    }

    saveItems (): Promise<Array<IRevisionResponse>> {
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

    saveTrainingPlanItems (): Promise<Array<IRevisionResponse>> {
        return Promise.all(<any>this.competition.items.map(i => {
                i.item = new Activity(i.item.build(), this.options);
                if ( this.competition.view.isPost ) {
                    return this.trainingPlansService.postItem(this.options.trainingPlanOptions.planId, i.item.build());
                }
                if ( this.competition.view.isPut && i.dirty) {
                    return this.trainingPlansService.putItem(this.options.trainingPlanOptions.planId, i.item.build());
                }
            })
        );
    }

    delete (): void {
        if ( this.competition.view.isTrainingPlan ) {
            this.deleteTrainingPlanItems();
        } else {
            this.deleteCalendarItems();
        }
    }

    deleteCalendarItems (): void {
        Promise.resolve(() => {})
            .then(() => this.competition.isCompleted && this.dialogs.confirm({text: 'dialogs.deleteActualCompetition'}))
            .then(() => this.calendarService.deleteItem('F', [this.competition.calendarItemId]))
            .then(() => {
                this.message.toastInfo('competitionDeleted');
                this.onAnswer({ formMode: FormMode.Delete, item: this.competition.build() });
            }, error => error && this.message.toastError(error));
    }

    deleteTrainingPlanItems (): void {
        this.trainingPlansService.deleteItem(this.options.trainingPlanOptions.planId, this.competition.build())
            .then(() => {
                this.message.toastInfo('competitionDeleted');
                this.onAnswer({ formMode: FormMode.Delete, item: this.competition.build() });
            }, error => error && this.message.toastError(error));
    }

    private close (): void {
        this.onCancel();
    }
}

export const CalendarItemCompetitionComponent: IComponentOptions = {
    bindings: {
        index: '<',
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