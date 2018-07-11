import {IComponentController, IComponentOptions, IPromise, IScope} from "angular";
import {
    CalendarItemActivityCtrl,
    HeaderStructuredTab,
} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import "./assignment-summary-structured.component.scss";
import { IQuillConfig } from "@app/share/quill/quill.config";
import {ActivityIntervalG} from "@app/activity/activity-datamodel/activity.interval-g";

class AssignmentSummaryStructuredCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    onChange: () => IPromise<void>;

    private readonly structuredMeasure: any = {
        movingDuration: {
            length: "movingDurationLength",
            approx: "movingDurationApprox",
        },
        distance: {
            length: "distanceLength",
            approx: "distanceApprox",
        },
    };

    static $inject = ['quillConfig', '$scope'];

    constructor(private quillConf: IQuillConfig, private $scope: IScope) {

    }

    $onInit() {
        this.onChange();
    }
    private changeStructuredMode() {
        this.item.structuredMode = false;
        if (this.item.structuredMode) {
            // Переключение на структурированную
            // Надоли удалять/очищать суммарный интервал? Скорее всего нет, при создании первого структурированного
            // интервала сумарный интервал пересчитается
            this.item.selectedTab = HeaderStructuredTab.Segments;
            //this.item.activity.updateIntervals();
        } else {
            // Переключение со структурированной на не структурированную
            this.item.activity.intervals.stack.filter((i) => i.type === "P" || i.type === "G")
                .map((i) => this.item.activity.intervals
                    .splice(i.type, i.type === "P" ? i.pos : (i as ActivityIntervalG).code, "single"));
            this.item.activity.intervals.PW.calculate(this.item.activity.intervals.P);
            this.item.assignmentForm.$setValidity('needInterval', true);
            this.item.assignmentForm.$setValidity('needDuration', true);
            this.item.templateChangeCount ++;
            //this.item.activity.updateIntervals();
        }
    }
}

const AssignmentSummaryStructuredComponent: IComponentOptions = {
    bindings: {
        data: "<",
        onChange: "&",
    },
    require: {
        item: "^calendarItemActivity",
    },
    controller: AssignmentSummaryStructuredCtrl,
    template: require("./assignment-summary-structured.component.html") as string,
};

export default AssignmentSummaryStructuredComponent;
