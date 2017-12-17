import './training-season-form.component.scss';
import { IComponentOptions, IComponentController, copy, INgModelController } from 'angular';
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { FormMode } from "../../application.interface";
import MessageService from "../../core/message.service";
import { IQuillConfig } from "../../share/quill/quill.config";
import { TrainingSeasonService } from "../training-season.service";
import { IRevisionResponse } from "../../../../api/core/core";
import { PeriodizationService } from "../../methodology/periodization/periodization.service";
import { IPeriodizationScheme } from "../../../../api/seasonPlanning/seasonPlanning.interface";
import { ITrainingSeasonSettings } from "../training-season.settings";

class TrainingSeasonFormCtrl implements IComponentController {
    // bind
    data: TrainingSeason;
    mode: FormMode;
    onSave: (response: { mode: FormMode, season: TrainingSeason }) => Promise<void>;

    // private
    private schemeList: Array<IPeriodizationScheme>;
    private season: TrainingSeason;
    private seasonForm: INgModelController;

    // inject
    static $inject = ['TrainingSeasonSettings', 'TrainingSeasonService', 'PeriodizationService', 'message', 'quillConfig'];

    constructor (
        private settings: ITrainingSeasonSettings,
        private trainingSeasonService: TrainingSeasonService,
        private periodizationService: PeriodizationService,
        private message: MessageService,
        private quillConf: IQuillConfig) {

    }

    set schemes (result: Array<IPeriodizationScheme>) {
        this.schemeList = result;
        if (this.schemeList && this.schemeList.length === 0) { this.season.periodizationScheme.id = this.schemeList[0].id; }
    }

    $onInit() {
        this.periodizationService.get().then(result => this.schemes = result.arrayResult, error => {});
        this.season = new TrainingSeason(copy(this.data));
    }

    save (): void {
        if (this.mode === FormMode.Post) {
            this.trainingSeasonService
                .post(this.season.prepare())
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        season: this.season.applyRevision(response)
                    }),
                    (error) => this.message.toastInfo(error));
        }

        if (this.mode === FormMode.Put) {
            this.trainingSeasonService
                .put(this.season.prepare())
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        season: this.season.applyRevision(response)
                    }),
                    (error) => this.message.toastInfo(error));
        }
    }

    get isPostMode (): boolean {
        return this.mode === FormMode.Post;
    }

    get isViewMode (): boolean {
        return this.mode === FormMode.View;
    }

    setChangeMode (): void {
        this.mode = FormMode.Put;
    }
}

export const TrainingSeasonFormComponent:IComponentOptions = {
    bindings: {
        data: '<',
        mode: '<',
        onCancel: '&',
        onSave: '&'
    },
    controller: TrainingSeasonFormCtrl,
    template: require('./training-season-form.component.html') as string
};