import { ICalendarItemDialogOptions } from "../../calendar-item/calendar-item-dialog.interface";
import { FormMode } from "../../application.interface";
export class ActivityView {

    constructor (private options: ICalendarItemDialogOptions) {

    }

    get isView (): boolean {
        return this.options.formMode === FormMode.View;
    }

    get isPost (): boolean {
        return this.options.formMode === FormMode.Post;
    }

    get isPut (): boolean {
        return this.options.formMode === FormMode.Put;
    }

    get isTemplate (): boolean {
        return this.options.templateMode;
    }

    get isTrainingPlan (): boolean {
        return this.options.trainingPlanMode;
    }

}