import {IComponentController, IComponentOptions, INgModelController, IPromise} from "angular";
import {
    CalendarItemActivityCtrl,
    HeaderStructuredTab,
} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {FtpState} from "../assignment/assignment.component";
import "./activity-assignment-header.component.scss";
import { IActivityCategory } from "../../../../../api/reference/reference.interface";

class ActivityAssignmentHeaderCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    private onChange: (result: { form: INgModelController }) => IPromise<void>;

    private form: INgModelController;
    ftpMode: number;

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    private filterActivityType (category: IActivityCategory, itemBasicCode: string) {
        debugger;
        return category.visible && category.activityType.code === itemBasicCode;
    }

    private changeParam() {
        setTimeout(() => {
            this.clearTemplate();
            this.updateForm();
            this.item.updateFilterParams();
        }, 100);
    }

    /**
     * Смена типа задания тренировки: по сегментам или общее
     * Смене из одного типа в другой предидущие данные полностью удаляются, на будущее возможен
     * подтверждающий диалог для пользователя
     */
    private changeStructuredMode() {
        if (this.item.structuredMode) {
            // Переключение на структурированную
            // Надоли удалять/очищать суммарный интервал? Скорее всего нет, при создании первого структурированного
            // интервала сумарный интервал пересчитается
            this.item.selectedTab = HeaderStructuredTab.Segments;
            //this.item.activity.updateIntervals();
        } else {
            // Переключение со структурированной на не структурированную
            this.item.activity.intervals.stack
                .filter((i) => i.type === "P" || i.type === "G")
                .map((i) => this.item.activity.intervals.splice(i.type, i.pos, "single"));

            this.item.activity.intervals.PW.calculate(this.item.activity.intervals.P);
            //this.item.activity.updateIntervals();
        }
    }

    private clearTemplate() {
        this.item.activity.header.template = null;
    }

    private onTemplateOpen() {
        this.item.showSelectTemplate = true;
    }

    private ftpModeChange(mode: FtpState) {
        this.ftpMode = mode;
        this.item.ftpMode = mode;
        //this.prepareValues();
    }

    private updateForm() {
        this.onChange({form: this.form});
    }

    get templateSelectorText(): string {
        return this.item.activity.header.template && "activity.template.code" ||
            this.item.templateByFilter && "activity.template.enable" || "activity.template.empty";
    }
}

const ActivityAssignmentHeaderComponent: IComponentOptions = {
    bindings: {
        data: "<",
        onChange: "&",
    },
    require: {
        item: "^calendarItemActivity",
    },
    controller: ActivityAssignmentHeaderCtrl,
    template: require("./activity-assignment-header.component.html") as string,
};

export default ActivityAssignmentHeaderComponent;
