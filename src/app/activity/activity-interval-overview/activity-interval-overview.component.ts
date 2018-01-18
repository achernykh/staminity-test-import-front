import {IComponentController, IComponentOptions, IFilterService, IPromise} from "angular";
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {ActivityIntervalG} from "../activity-datamodel/activity.interval-g";
import {ActivityIntervalL} from "../activity-datamodel/activity.interval-l";
import {ActivityIntervalP} from "../activity-datamodel/activity.interval-p";
import "./activity-interval-overview.component.scss";

class ActivityIntervalOverviewCtrl implements IComponentController {

    interval: ActivityIntervalP | ActivityIntervalL;
    private item: CalendarItemActivityCtrl;

    private title: string = null;
    private isSegment: boolean = false;
    private isSegmentGroup: boolean = false;
    private groupInfo: ActivityIntervalG;
    private selection: Array<{startTimestamp: number, endTimestamp: number}> = [];

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

    onBack: (response: Object) => IPromise<void>;
    static $inject = ["$filter"];

    constructor(private $filter: IFilterService) {

    }

    $onInit() {
        this.prepareInterval();
        this.prepareTitle();
        this.prepareSelection();
    }

    private prepareInterval() {
        this.isSegment = this.interval.type === "P";
        this.isSegmentGroup = this.isSegment && this.interval.hasOwnProperty("totalMeasures");
        this.groupInfo = this.isSegmentGroup && this.item.activity.intervals.G.filter((g) => g.code === this.interval["parentGroupCode"])[0] || null;
    }

    private prepareTitle() {
        if (this.isSegment) {
            this.title = this.interval.hasOwnProperty("totalMeasures") &&
                `${this.$filter["translate"]("activity.split.segmentGroup", {count: this.groupInfo.repeatCount})}` ||
                `${this.$filter["translate"]("activity.split.segment")} #${this.interval.pos}`;
        } else {
            this.title = `${this.$filter["translate"]("activity.split.interval")}`;
        }
    }

    private prepareSelection() {
        if (this.isSegmentGroup) {
            this.item.activity.intervals.stack.
                filter((i) => i.hasOwnProperty("parentGroupCode") && i["parentGroupCode"] === this.interval["parentGroupCode"] &&
                    (i.pos - this.interval.pos) % this.groupInfo.grpLength === 0 &&
                    this.selection.push({startTimestamp: i.startTimestamp, endTimestamp: i.endTimestamp}));
        } else {
            this.selection.push({startTimestamp: this.interval.startTimestamp, endTimestamp: this.interval.endTimestamp});
        }
    }

}

const ActivityIntervalOverviewComponent: IComponentOptions = {
    bindings: {
        interval: "<",
        onBack: "&",
    },
    require: {
        item: "^calendarItemActivity",
    },
    controller: ActivityIntervalOverviewCtrl,
    template: require("./activity-interval-overview.component.html") as string,
};

export default ActivityIntervalOverviewComponent;
