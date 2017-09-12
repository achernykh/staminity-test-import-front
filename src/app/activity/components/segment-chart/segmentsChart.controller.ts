import * as d3 from 'd3';
import { IComponentController } from 'angular';
import { FillType, IGradientPoint, IFilledShape, IPlanChartSettings } from './settings/settings.models';
import { IInputPlanSegment } from './segmentsChart.input';
import { PlanChartDatamodel, IPlanInterval, IntervalStatus } from './segmentsChart.datamodel';
import LabelFormatters from './utils/labelFormatter';
import './segmentsChart.component.scss';

const PlanChartMode = {
    distance: "distance",
    movingDuration: "movingDuration",
    ensure: function (type) {
        return (type === PlanChartMode.distance) ?
            PlanChartMode.distance :
            PlanChartMode.movingDuration;
    }
};

interface ISegmentChartScales {
    ftp: d3.ScaleLinear<number, number>;
    distance: d3.ScaleLinear<number, number>;
    movingDuration: d3.ScaleLinear<number, number>;
}

type ChartMode = "plan" | "fact";

class SegmentChartController implements IComponentController {

    private activityHeader: Array<IInputPlanSegment>;
    private select: Array<number>;
    private actualFtp;
    private planFtp;
    private view: string;
    private durationMeasure: string;
    private onSelect: Function;

    private intervals: Array<IPlanInterval>;
    private scales: ISegmentChartScales;

    private $placeholder: any;
    private $interactiveArea: any;
    private $tooltip: any;
    private isReady: boolean;

    private absUrl: string;
    private gradientId: number = 0;

    private height: number;
    private width: number;
    private onResize: Function;

    static $inject = ['$element', '$location', '$window', 'segmentChartSettings','$mdMedia'];

    constructor(
        private $element: JQuery,
        private $location,
        private $window,
        private chartSettings: IPlanChartSettings,
        private $mdMedia: any) {

        if (this.view !== 'mobile') {
            this.chartSettings.minAspectRation = (this.$mdMedia('gt-md') && 0.20)
                || (this.$mdMedia('gt-lg') && 0.10)
                || this.chartSettings.minAspectRation;
        }
    }

    $onInit(): void {
        this.absUrl = this.$location.absUrl().split('#')[0];
        this.prepareData();
    }

    $postLink(): void {
        let self = this;
        this.$element.ready(function () {
            setTimeout(() => {
                self.isReady = true;
                self.preparePlaceholder();
                self.prepareScales();
                self.drawChart();
            }, 500);
        });
        if (this.chartSettings.autoResizable) {
            this.onResize = function () { self.redraw(); };
            angular.element(this.$window).on('resize', self.onResize);
        }
    }

    $onChanges(changes: any): void {
        this.durationMeasure = PlanChartMode.ensure(this.durationMeasure);
        let isFirst = true;
        for (let item in changes) {
            isFirst = isFirst && changes[item].isFirstChange();
        }
        if (isFirst) {
            return;
        }
        this.prepareData();
        if (this.isReady) {
            this.cleanupPlaceholder();
            this.preparePlaceholder();
            this.prepareScales();
            this.drawChart();
        }
    }

    $onDestroy(): void {
        if (this.chartSettings.autoResizable && !!this.onResize) {
            angular.element(this.$window).off('resize', this.onResize);
        }
    }

    redraw() {
        if (!!this.$placeholder) {
            this.$placeholder.remove();
        }
        this.preparePlaceholder();
        this.prepareScales();
        this.drawChart();
    }

    private prepareData(): void {
        let model = new PlanChartDatamodel(this.activityHeader);
        this.intervals = model.getIntervals();
        this.select = model.getSelect() || [];
        //this.actualFtp = this.actualFtp === "true";
        //this.planFtp = this.planFtp === "true";
        this.durationMeasure = PlanChartMode.ensure(this.durationMeasure);
    }

    private prepareScales(): void {
        //debugger;
        let mode: ChartMode = this.actualFtp ? "fact" : "plan";
        let totalDuration = d3.sum(this.intervals, function (d: IPlanInterval) { return d[mode].movingDuration.duration; });
        let totalDistance = d3.sum(this.intervals, function (d: IPlanInterval) { return d[mode].distance.duration; });
        let maxFTP = 0;
        let minFTP = Infinity;
        for (var i = 0; i < this.intervals.length; i++) {
            let interval = this.intervals[i];
            if (this.actualFtp && interval.fact[this.durationMeasure].duration > 0) {
                maxFTP = Math.max(maxFTP, interval.fact.intensityByFtp);
                minFTP = Math.min(minFTP, interval.fact.intensityByFtp);
            }
            if (this.planFtp && interval.plan[this.durationMeasure].duration > 0) {
                maxFTP = Math.max(maxFTP, interval.plan.intensityByFtp);
                minFTP = Math.min(minFTP, interval.plan.intensityByFtp);
            }
        }
        maxFTP = maxFTP + this.chartSettings.rangeScaleOffset.max;
        minFTP = Math.max(0, minFTP - this.chartSettings.rangeScaleOffset.min);
        this.scales =
            {
                ftp: d3.scaleLinear().range([this.height, 0]).domain([minFTP, maxFTP]),
                distance: d3.scaleLinear().range([0, this.width]).domain([0, totalDistance]),
                movingDuration: d3.scaleLinear().range([0, this.width]).domain([0, totalDuration])
            };
    }

    private preparePlaceholder(): void {
        //let parent: Element = angular.element(document).find('activity-segment-chart')[0];
        this.width = this.$element[0].clientWidth;//parent.clientWidth;
        this.height = this.$element[0].clientHeight;//parent.clientHeight;

        //var bounds = this.$element[0].getBoundingClientRect();
        //this.width = Math.max(bounds.width, this.chartSettings.minWidth);
        //this.height = bounds.height;
        //var aspectRatio = this.height / this.width;
        //if (aspectRatio < this.chartSettings.minAspectRation) {
        //    this.height = this.width * this.chartSettings.minAspectRation;
        //}
        let container = d3.select(this.$element[0]);
        // create root svg placeholder
        this.$placeholder = container
            .append("svg")
            .attr('class', 'plan-chart')
            .attr("width", this.width)
            .attr("height", this.height);
        // update information about the chart area size
        var gridSettings = this.chartSettings.grid;
        this.width = this.width - gridSettings.ftp.offset;
        this.height = this.height - gridSettings[this.durationMeasure].offset;
        // append svg group for chart interactive area (main area withoud axis)
        this.$interactiveArea = this.$placeholder
            .append("g")
            .attr('class', 'chart-interactive-area')
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("transform", "translate(" + gridSettings.ftp.offset + ",0)");
        this.$placeholder.append('g').attr('class', 'segments-chart-grid');
        // store link to the tooltip template
        this.$tooltip = container.select('.tooltip');
    }

    private cleanupPlaceholder(): void {
        this.$interactiveArea.remove();
        this.$placeholder.remove();
    }

    private drawChart(): void {
        this.drawGrid();
        this.drawPlanChart();
        this.drawFactChart();
        this.drawSelects();
        this.setupHover();
        this.setupTooltip();
    }

    private drawGrid(): void {
        this.drawDomainAxis();
        this.drawRangeAxis();
    }

    private drawDomainAxis(): void {
        let labelFormatter = LabelFormatters[this.durationMeasure].formatter;
        let rangeInfo = this.scales[this.durationMeasure];
        let settings = this.chartSettings.grid[this.durationMeasure];
        let ticks = this.calcTics(rangeInfo, settings);
        let lastTick = ticks.length - 1;
        let xAxis = d3.axisBottom(rangeInfo)
            .tickSizeOuter(0)
            .tickValues(ticks)
            .tickFormat(function (d: number, i: number) {
                if (i === lastTick) { return ''; }
                return (i % settings.ticksPerLabel === settings.fistLabelAtTick) ? labelFormatter(d) : '';
            });
        this.$placeholder.select('.segments-chart-grid')
            .append("g")
            .attr("class", "axis-x")
            .attr("transform", "translate(" + this.chartSettings.grid.ftp.offset + "," + this.height + ")")
            .call(xAxis);
    }

    private drawRangeAxis(): void {
        let rangeInfo = this.scales.ftp;
        let settings = this.chartSettings.grid.ftp;
        let ticks = this.calcTics(rangeInfo, settings);
        let yAxis = d3.axisLeft(rangeInfo)
            .tickSizeOuter(0)
            .tickSize(-this.width)
            .tickValues(ticks)
            .tickFormat(function (d: number, i: number) {
                return (i % settings.ticksPerLabel === settings.fistLabelAtTick) ? LabelFormatters.ftp.formatter(d) : '';
            });
        let axis = this.$placeholder
            .select('.segments-chart-grid')
            .append("g")
            .attr("class", "axis-y-stroke")
            .attr("transform", "translate(" + this.chartSettings.grid.ftp.offset + ",0)")
            .call(yAxis);
        axis.selectAll('text')
            .style('fill', settings.color)
            .attr("transform", "translate(" + -(this.chartSettings.grid.ftp.offset - 5) + ",0)")
            .style("text-anchor", "start");
        axis.select(".domain").remove();
    }

    private drawPlanChart(): void {
        if (!this.planFtp) {
            return;
        }
        let mode: ChartMode = this.actualFtp ? "fact" : "plan";
        let domain = this.durationMeasure;
        let xScale = this.scales[domain];
        let yScale = this.scales.ftp;
        //
        let keyFill = this.getFillColor(this.chartSettings.planArea.keySegment);
        let defaultFill = this.getFillColor(this.chartSettings.planArea.area);
        let chartHeight = this.height;
        //
        this.$interactiveArea.selectAll(".interval-plan")
            .data(this.intervals)
            .enter().append("rect")
            .filter(function (d) { return d[mode][domain].duration > 0; })
            .attr("class", "interval plan ttp-interval")
            .attr("data-interval-id", function (d) { return d.originId; })
            .attr("x", function (d: IPlanInterval) { return xScale(d[mode][domain].start); })
            .attr("y", function (d: IPlanInterval) { return yScale(d.plan.intensityByFtp); })
            .attr("width", function (d) { return xScale(d[mode][domain].duration); })
            .attr("height", function (d) { return chartHeight - yScale(d.plan.intensityByFtp); })
            .attr("fill", function (d) { return d.isKey ? keyFill : defaultFill; })
            .attr('pointer-events', 'all');
        //
        let bottomFtp = yScale.domain()[0];
        let edges = [{ start: 0, intensityByFtp: bottomFtp }];
        for (var i = 0; i < this.intervals.length; i++) {
            let seg = this.intervals[i];
            edges.push({
                start: seg[mode][domain].start,
                intensityByFtp: Math.max(bottomFtp, seg.plan.intensityByFtp)
            });
        }
        let lastSeg = this.intervals[this.intervals.length - 1];
        edges.push({ start: xScale.domain()[1], intensityByFtp: Math.max(bottomFtp, lastSeg.plan.intensityByFtp) });
        edges.push({ start: xScale.domain()[1], intensityByFtp: bottomFtp });

        let borderLine = d3.line()
            .x(function (d: any) { return xScale(d.start); })
            .y(function (d: any) { return yScale(d.intensityByFtp); })
            .curve(d3.curveStepAfter);

        this.$interactiveArea
            .append("path")
            .datum(edges)
            .attr("d", borderLine)
            .attr("class", "plan-border");
    }

    private setupHover(): void {
        let hoversettings = this.chartSettings.hoverArea;
        let hoverFillStyle = this.getFillColor(hoversettings.area);
        let hoverStrokeStyle = this.getFillColor(hoversettings.border);
        let hover = this.$interactiveArea.append("rect").attr("x", 0).attr("y", 0)
            .attr("width", 0).attr("height", this.height)
            .attr("fill", hoverFillStyle)
            .attr("stroke", hoverStrokeStyle)
            .attr('pointer-events', 'none')
            .style("display", "none");

        let settings = this.chartSettings.selectArea;
        let fillStyle = this.getFillColor(settings.area);
        let strokeStyle = this.getFillColor(settings.border);
        let self = this;
        this.$interactiveArea.selectAll(".interval")
            .on("mouseover.hover", function () {
                let current = d3.select(this);
                hover
                    .attr("x", current.attr("x"))
                    .attr("width", current.attr("width"))
                    .style("display", "block");
            })
            .on("mouseout.hover", function () {
                hover.style("display", "none");
            })
            .on("click", function () {
                let current = d3.select(this);
                self.$interactiveArea.selectAll('.selected-segment').remove();
                self.$interactiveArea.append("rect")
                    .attr('class', 'selected-segment')
                    .attr("x", current.attr("x")).attr("y", 0)
                    .attr("width", current.attr("width"))
                    .attr("height", self.height)
                    .attr('pointer-events', 'none')
                    .attr("fill", fillStyle)
                    .attr("stroke", strokeStyle);
                let segmentId = current.attr('data-interval-id');
                self.onSelect({segmentId: segmentId});
            });
    }

    private setupTooltip(): void
    {
        let self = this;

        this.$tooltip.select('.fact')
            .style("display", (this.actualFtp ? "block" : "none"));
        this.$interactiveArea
            .append("line")
            .attr("class", 'tooltip_line')
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", 0).attr("y2", this.height)
            .style("stroke", this.chartSettings.grid.color)
            .style("stroke-width", this.chartSettings.grid.width)
            .attr('pointer-events', 'none')
            .style("display", "none");
        this.$interactiveArea.selectAll(".ttp-interval")
            .on("mousemove.tooltip", function () {
                let mouse = d3.mouse(this);
                d3.selectAll('.tooltip_line')
                    .attr("x1", mouse[0]).attr("y1", 0)
                    .attr("x2", mouse[0]).attr("y2", self.height)
                    .style("display", "block");
                //update tooltip position
                let ttpSize = self.$tooltip.node().getBoundingClientRect();
                let xPos = (mouse[0] + ttpSize.width + 20 > self.width) ?
                    (d3.event.pageX - 10 - ttpSize.width) :
                    (d3.event.pageX + 10);
                let yPos = d3.event.pageY - (mouse[1] - self.height / 2) - ttpSize.height / 2;
                self.$tooltip.style("left", xPos + "px").style("top", yPos + "px");
                // update tooltip info
                let intervalId = d3.select(this).attr('data-interval-id');
                let interval = self.intervals[intervalId];
                self.$tooltip.select('.index').text(parseInt(intervalId) + 1);
                self.$tooltip.selectAll('.duration').attr('class', 'duration ' + interval.durationMeasure);
                self.$tooltip.selectAll('.intensivity').attr('class', 'intensivity ' + interval.intensityMeasure);
                // update plan info
                let plan = self.$tooltip.select('.plan');
                let domain = interval.durationMeasure;
                plan.select('.duration').text(
                    interval.plan[domain].duration > 0 ?
                    (LabelFormatters[domain].formatter(interval.plan[domain].duration) + LabelFormatters[domain].label): "-");
                plan.select('.intensivity').text(interval.plan.intensityByFtp > 0 ?
                    (interval.plan.intensityByFtp.toFixed(0) + " %") : "-");
                // update fact info if presented
                if (self.actualFtp) {
                    let fact = self.$tooltip.select('.fact');
                    fact.select('.duration').text(interval.fact[domain].duration > 0 ?
                        (LabelFormatters[domain].formatter(interval.fact[domain].duration) + LabelFormatters[domain].label) : "-");
                    fact.select('.intensivity').text(interval.fact.intensityByFtp > 0 ?
                        (LabelFormatters.ftp.formatter(interval.fact.intensityByFtp) + LabelFormatters.ftp.label) : "-");
                }
            }).on("mouseover.tooltip", function () {
                d3.selectAll('.tooltip_line').style("display", "block");
                self.$tooltip.style('display', 'block');
            }).on("mouseout.tooltip", function () {
                d3.selectAll('.tooltip_line').style("display", "none");
                self.$tooltip.style('display', 'none');
            });
    }

    private drawFactChart(): void {
        if (!this.actualFtp) {
            return;
        }
        let domain = this.durationMeasure;
        let xScale = this.scales[domain];
        let yScale = this.scales.ftp;
        let height = this.height;
        let segments = [];
        let missedSegments = [];
        let prevItem = null;
        for (var i = 0; i < this.intervals.length; i++) {
            let seg = this.intervals[i];
            if (seg.fact[domain].duration === 0) {
                let prevFtp = !prevItem ? Infinity : prevItem.to;
                let nextFtp = i + 1 < this.intervals.length ? this.intervals[i + 1].fact.intensityByFtp : Infinity;
                missedSegments.push({
                    pos: xScale(seg.fact[domain].start),
                    height: yScale(Math.min(prevFtp, nextFtp)),
                    originId: seg.originId
                });
                continue;
            }
            let item = {
                start: seg.fact[domain].start,
                end: seg.fact[domain].start + seg.fact[domain].duration,
                from: seg.fact.intensityByFtp,
                to: seg.fact.intensityByFtp,
                status: IntervalStatus[seg.status],
            };
            if (prevItem !== null) {
                let currStatus = prevItem.to > item.from ? prevItem.status : item.status;
                segments.push({
                    start: prevItem.end,
                    end: prevItem.end,
                    from: prevItem.to,
                    to: item.from,
                    status: currStatus,
                });
            }
            segments.push(item);
            prevItem = item;
        }

        // main status line
        this.$interactiveArea.selectAll('.segment-status')
            .data(segments)
            .enter().append("line")
            .attr('class', function (d) { return 'segment-status ' + d.status; })
            .attr('x1', function (d) { return xScale(d.start); })
            .attr('x2', function (d) { return xScale(d.end); })
            .attr('y1', function (d) { return yScale(d.from); })
            .attr('y2', function (d) { return yScale(d.to); });

        // transparent background for onHover events
        this.$interactiveArea.selectAll(".interval-fact")
            .data(this.intervals)
            .enter().append("rect")
            .filter(function (d) { return d.fact[domain].duration > 0; })
            .attr("class", "interval fact ttp-interval")
            .attr("data-interval-id", function (d) { return d.originId; })
            .attr("x", function (d: IPlanInterval) { return xScale(d.fact[domain].start); })
            .attr("y", function (d: IPlanInterval) { return yScale(d.fact.intensityByFtp); })
            .attr("width", function (d) { return xScale(d.fact[domain].duration); })
            .attr("height", function (d) { return height - yScale(d.fact.intensityByFtp); })
            .attr("fill", 'rgba(255, 255, 255, 0)').attr('stroke', 'none')
            .attr('pointer-events', 'all');

        // missed segments
        let markers = this.$interactiveArea.selectAll('.missed-segment')
            .data(missedSegments).enter()
            .append('g').attr('class', 'missed-segment');
        markers
            .append("line")
            .attr('x1', function (d) { return d.pos; })
            .attr('x2', function (d) { return d.pos; })
            .attr('y1', function (d) { return d.height; })
            .attr('y2', function () { return height; });
        markers.append('circle')
            .attr('cx', function (d) { return d.pos; })
            .attr('cy', function (d) { return (d.height + height) / 2; })
            .attr('class', 'ttp-interval')
            .attr('data-interval-id', function (d) { return d.originId;  })
            .attr('pointer-events', 'all')
            .attr('r', 7);
        markers.append('text')
            .attr('dx', function (d) { return d.pos; })
            .attr('dy', function (d) { return (d.height + height + 6) / 2; })
            .attr('pointer-events', 'none')
            .text('\u274C');
    }

    private drawSelects(): void {
        if (this.select.length < 1) {
            return;
        }
        //
        let mode: ChartMode = this.actualFtp ? "fact" : "plan";
        let settings = this.chartSettings.selectArea;
        let fillStyle = this.getFillColor(settings.area);
        let strokeStyle = this.getFillColor(settings.border);
        let domain = this.durationMeasure;
        let xScale = this.scales[domain];
        //
        for (let i = 0; i < this.select.length; i++) {
            let area = this.intervals[this.select[i]][mode][domain];
            let start = xScale(area.start);
            let width = xScale(area.duration);
            this.$interactiveArea.append("rect")
                .attr('class', 'selected-segment')
                .attr("x", start)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", this.height)
                .attr("fill", fillStyle)
                .attr("stroke", strokeStyle)
                .attr('pointer-events', 'none');
        }
    }

    //todo shared utils
    private calcTics(scale, settings): Array<number> {
        let currStep = settings.tickMinStep;
        let min = Math.min.apply(null, scale.domain());
        let max = Math.max.apply(null, scale.domain());
        let currDist = Math.abs(scale(min + currStep) - scale(min + currStep * 2));
        if (currDist < settings.tickMinDistance) {
            currStep = currStep * Math.ceil(settings.tickMinDistance / currDist);
        }
        let tickVals = [];
        let currentTick = (Math.floor(min / currStep) + 1) * currStep;
        while (currentTick < max) {
            tickVals.push(currentTick);
            currentTick = currentTick + currStep;
        }
        return tickVals;
    }

    //todo shared utils
    public getFillColor(areaSettings: IFilledShape): string {
        switch (areaSettings.fillType) {
            case FillType.Gradient:
                let gradientId = this.getGradient(areaSettings.gradient);
                // absolute url should be used to avoid problems with angular routing and <base> tag
                return "url(" + this.absUrl + "#" + gradientId + ")";
            case FillType.Solid:
                return areaSettings.solidColor;
            default:
                return "none";
        }
    }

    //todo shared utils
    // create new svg gradien based on provided gradient points and max area height
    private getGradient(gradientPoints: Array<IGradientPoint>, heightRation: number = 1): string {
        let index = "lnrGradientSeg" + this.gradientId;
        this.gradientId = this.gradientId + 1;
        this.$placeholder.append("linearGradient")
            .attr("id", index)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", (100 * (1 - heightRation) + '%'))
            .attr("x2", 0).attr("y2", '100%')
            .selectAll("stop")
            .data(gradientPoints)
            .enter().append("stop")
            .attr("offset", function (d) { return d.offset; })
            .attr("stop-color", function (d) { return d.color; })
            .attr("stop-opacity", function (d) { return d.opacity; }); // fix for Safari;
        return index;
    };
}

export default SegmentChartController;