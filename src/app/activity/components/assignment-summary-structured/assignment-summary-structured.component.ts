import {IComponentController, IComponentOptions, IPromise} from "angular";
import {
    CalendarItemActivityCtrl,
    HeaderStructuredTab,
} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import "./assignment-summary-structured.component.scss";

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

    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.onChange();
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
