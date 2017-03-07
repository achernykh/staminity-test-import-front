import * as d3 from 'd3';
import { IComponentController, element } from 'angular';
import { FillType, IActivityChartSettings, IAreaSettings, IGradientPoint, ActivityChartMode } from "./settings/settings.models";
import { ActivityChartDatamodel } from "./chart.datamodel";
import { ScaleType, IScaleInfo, IActivityScales } from "./utils/chart.scale";
import LabelFormatters from "./utils/labelFormatter";
import './chart.component.scss';
import {select} from "d3-selection";

class ActivityChartController implements IComponentController {

    private supportedMetrics: Array<string> = ['speed', 'altitude', 'heartRate'];

    private measures;
    private data;
    private select;
    private x: string;
    public onSelected: (result: Array<{startTimeStamp:number, endTimeStamp:number}>) => void;

    private onResize: Function;

    private currentMode: ActivityChartMode;
    private chartData: ActivityChartDatamodel;
    private scales: IActivityScales;
    private height: number;
    private width: number;

    private $placeholder: any;
    private $interactiveArea: any;
    private $tooltip: any;

    private absUrl: string;
    private gradientId: number = 0;
    private state: {
        inTransition: boolean,
        inSelection: boolean
    };

    static $inject = ['$element', '$location', '$window', 'activityChartSettings','$mdMedia'];

    constructor(
        private $element,
        private $location,
        private $window,
        private activityChartSettings: IActivityChartSettings,
        private $mdMedia: any) {

        this.activityChartSettings.minAspectRation = (this.$mdMedia('gt-md') && 0.20)
            || (this.$mdMedia('gt-lg') && 0.10)
            || this.activityChartSettings.minAspectRation;
    }

    $onInit() {
        this.prepareData();
    }

    $postLink(): void {
        let self = this;
        this.$element.ready(function () {
            self.preparePlaceholder();
            self.prepareScales();
            self.drawChart();
        });
        if (this.activityChartSettings.autoResizable) {
            this.onResize = function () { self.redraw(); };
            angular.element(this.$window).on('resize', self.onResize);
        }
    }

    $onChanges(changes: any): void {
        let isFirst = true;
        for (let item in changes) {
            isFirst = isFirst && changes[item].isFirstChange();
        }
        if (isFirst) {
            return;
        }
        if (changes.data && changes.data.currentValue) {
            this.data = changes.data.currentValue;
        }
        if (changes.measures && changes.measures.currentValue) {
            this.measures = changes.measures.currentValue;
        }
        if (changes.select && changes.select.currentValue) {
            let isStandaloneChange = Object.keys(changes).length === 1;
            // ignore new input selected intervals if it's only one change and user is selecting the interval by himself
            if (isStandaloneChange && this.state.inSelection) {
                return;
            }
            this.select = changes.select.currentValue;
            if (isStandaloneChange) {
                // redraw only selected intervals
                this.prepareData();
                this.drawSelections();
                return;
            }
        }
        this.prepareData();
        this.redraw();
    }

    $onDestroy(): void {
        if (this.activityChartSettings.autoResizable && !!this.onResize) {
            angular.element(this.$window).off('resize', this.onResize);
        }
    }

    // call to change current chart mode and recreate the chart
    switchMode(mode: ActivityChartMode) {
        if (mode === this.currentMode) {
            return;
        }
        this.currentMode = mode;
        this.$placeholder.selectAll('.axis').remove();
        this.$placeholder.selectAll('.activity-area').remove();
        this.$placeholder.selectAll('.select-area').remove();
        this.drawChart();
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
        this.absUrl = this.$location.absUrl().split('#')[0];
        this.chartData = new ActivityChartDatamodel(this.measures, this.data, this.x, this.select);
        this.currentMode = this.x === 'elapsedDuration' ? ActivityChartMode.elapsedDuration : ActivityChartMode.distance;
        //this.currentMode = this.activityChartSettings.defaultMode;
        this.supportedMetrics = this.chartData.supportedMetrics();
        this.state = { inTransition: false, inSelection: false };
    }

    private preparePlaceholder(): void {
        // calc current chart size based on the conteiner size and chart's settings
        var bounds = this.$element[0].getBoundingClientRect();
        this.width = Math.max(bounds.width, this.activityChartSettings.minWidth);
        this.height = bounds.height;
        var aspectRatio = this.height / this.width;
        if (aspectRatio < this.activityChartSettings.minAspectRation) {
            this.height = this.width * this.activityChartSettings.minAspectRation;
        }
        let container = d3.select(this.$element[0]);
        // create root svg placeholder
        this.$placeholder = container
            .append("svg")
            .attr('class', 'activity-chart')
            .attr("width", this.width)
            .attr("height", this.height);
        // calc axis offsets based on metrics visability and chart settings
        var labelOffset = this.activityChartSettings.labelOffset;
        var visibleAxis = this.supportedMetrics.filter((a) => {
            return this.chartData.getMeasures()[a].show &&
                this.activityChartSettings[a].axis.hideOnWidth < this.width;
        });
        // update information about the chart area size
        this.width = this.width - visibleAxis.length * labelOffset;
        this.height = this.height - labelOffset;
        this.$placeholder.append('g').attr('class', 'activity-chart-grid');
        // append svg group for chart interactive area (main area withoud axis)
        this.$interactiveArea = this.$placeholder
            .append("g")
            .attr('class', 'chart-interactive-area')
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("transform", "translate(" + labelOffset + ",0)");
        // append transparent rectangle to ensure onmouse events
        this.$interactiveArea.append('rect')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", 'rgba(1, 1, 1, 0)');
        // store link to the tooltip template
        this.$tooltip = container.select('.tooltip');
    }

    private prepareScales(): void {
        // precalculate and cache chart scales for all metrics
        this.scales = {
            elapsedDuration: this.getScale("elapsedDuration", ScaleType.X),
            distance: this.getScale("distance", ScaleType.X),
            speed: this.getScale("speed", ScaleType.Y),
            heartRate: this.getScale("heartRate", ScaleType.Y),
            altitude: this.getScale("altitude", ScaleType.Y),
        };
    }

    private getScale(metric: string, type: ScaleType): IScaleInfo {
        let min = d3.min(this.chartData.getData(), function (d) { return d[metric]; });
        let max = d3.max(this.chartData.getData(), function (d) { return d[metric]; });
        let settings = this.activityChartSettings[metric];
        let range;
        if (type === ScaleType.X) {
            range = [0, this.width];
        } else {
            let heightRatio = settings.area.heightRatio;
            range = [this.height, this.height * (1 - heightRatio)];
        }
        let domain = (settings.flippedChart) ? [max, min] : [min, max];
        let scale = d3.scaleLinear()
            .range(range)
            .domain(domain);
        let info: IScaleInfo = {
            type: type,
            min: min,
            max: max,
            scale: scale
        };
        return info;
    }

    private drawChart(): void {
        this.drawGrid();
        this.drawMetricAreas();
        this.drawSelections();
        this.createTooltip();
    }

    private drawMetricAreas(): void {
        // draw chart areas for all visible metrics
        // in order specified in chart settings
        let metrics = this.chartData.getData();
        this.$interactiveArea.datum(metrics);
        let settings = this.activityChartSettings;
        let areas = this.supportedMetrics
            .filter((a) => this.chartData.getMeasures()[a].show)
            .sort(function (a, b) {
                let orderA = settings[a].order;
                let orderB = settings[b].order;
                return orderB - orderA;
            });
        for (let i = 0; i < areas.length; i++) {
            this.drawMetricArea(areas[i]);
        }
    }

    private drawMetricArea(metric: string): void {
        let domainMetric = ActivityChartMode[this.currentMode];
        let domainScale = this.scales[domainMetric].scale;
        let rangeScale = this.scales[metric].scale;
        let fillColor = this.getFillColor(this.activityChartSettings[metric].area);
        let bottomRange = this.height;
        let areaFunction = d3.area()
            .defined(this.isDataDefined)
            .x(function (d) { return domainScale(d[domainMetric]); })
            .y0(function () { return bottomRange; })
            .y1(function (d) { return rangeScale(d[metric]); });
        let initArea = d3.area()
            .defined(this.isDataDefined)
            .x(function (d) { return domainScale(d[domainMetric]); })
            .y0(function () { return bottomRange; })
            .y1(function () { return bottomRange; });
        this.$interactiveArea
            .append("path")
                .attr("d", initArea)
                .attr("fill", fillColor)
            .transition()
                .duration(this.activityChartSettings.animation.duration)
                .ease(this.activityChartSettings.animation.ease)
                .attr("d", areaFunction);
    }

    private drawSelections(): void {
        this.$interactiveArea.selectAll(".selected-interval").remove();
        let domain = ActivityChartMode[this.currentMode];
        let fillStyle = this.getFillColor(this.activityChartSettings.selectedArea.area);
        let strokeStyle = this.getFillColor(this.activityChartSettings.selectedArea.borderArea);
        let tsBisector =  d3.bisector(function (d) { return d['timestamp']; }).left; //todo share
        let xScale = this.scales[domain].scale;
        let data = this.chartData.getData();
        let selectIntervals = this.chartData.getSelect();
        for (let i = 0; i < selectIntervals.length; i++) {
            let interval = selectIntervals[i];
            let startIndex = Math.max(0, tsBisector(data, interval.startTimestamp));
            let endIndex = Math.min(data.length - 1, tsBisector(data, interval.endTimestamp));
            let start = xScale(data[startIndex][domain]);
            let end = xScale(data[endIndex][domain]);
            this.$interactiveArea
                .append("rect")
                    .attr("class", "selected-interval")
                    .attr("x", start)
                    .attr("y", this.height)
                    .attr("width", end - start)
                    .attr("fill", fillStyle)
                    .attr("stroke", strokeStyle)
                .transition()
                    .duration(this.activityChartSettings.animation.duration)
                    .ease(this.activityChartSettings.animation.ease)
                    .attr("y", 0)
                    .attr("height", this.height);
        }

        // Подготавливаем элемент для пользовательского селекта и добавляем отслеживание событий мыши
        let self = this;
        let initPos = null;
        let initData = {};
        let $selector = null;
        let $ttpSection = this.$tooltip.select(".deltas");

        let bisect = d3.bisector(function (d) { return d[domain]; }).left;
        let baseMetrics = this.chartData.getBaseMetrics();
        let tooltipMetrics = this.chartData.getBaseMetrics(["timestamp"]);
        let getInterpolatedData = function (pos: number): { [id: string]: number } {
            let domainValue = xScale.invert(pos);
            let index = bisect(data, domainValue);
            index = Math.min(data.length - 1, Math.max(1, index));
            let startData = data[index - 1];
            let endData = data[index];
            let dataRange = endData[domain] - startData[domain];
            let interpolatedData = {};
            // interpolate value of all base metrics
            for (let i = 0; i < baseMetrics.length; i++)
            {
                let metric = baseMetrics[i];
                if (metric === domain) {
                    interpolatedData[metric] = domainValue;
                    continue;
                }
                let interpolate = d3.interpolateNumber(startData[metric], endData[metric]);
                let metricValue = interpolate((domainValue % dataRange) / dataRange);
                interpolatedData[metric] = metricValue;
            }
            return interpolatedData;
        };

        let onSelectEnded = function (endPos: number): void {
            if (!self.state.inSelection) {
                return;
            }
            self.state.inSelection = false;
            // remove delta section from the tooltip
            $ttpSection.selectAll("*").remove();
            $ttpSection.style("display", "none");
            // calculate final interval selected by user
            let interval = null;
            if (endPos !== initPos)
            {
                let endData = getInterpolatedData(endPos);
                let endTimestamp = Math.round(endData["timestamp"]);
                let startTimestamp = Math.round(initData["timestamp"]);
                 // swap endTimestamp and startTimestamp in case of user selected the interval from right to left
                interval = endTimestamp > startTimestamp ?
                    { "startTimestamp": startTimestamp, "endTimestamp": endTimestamp } :
                    { "startTimestamp": endTimestamp, "endTimestamp": startTimestamp };
            }
            // update local information about chosen intervals
            self.select = !interval ? null: [ interval ];
            self.chartData.setSelect(self.select);
            // rise onSelected event
            self.onSelected(self.select);
        };

        let updateSelection = function (current: number): void {
            if (!self.state.inSelection) {
                return;
            }
            let x = Math.min(current, initPos);
            let width = Math.abs(current - initPos);
            $selector.attr('x', x).attr('width', width);
        };

        //interpolate timestamp from selected value
        this.$interactiveArea
            .on('mousedown.selection', function () {
                self.state.inSelection = true;
                self.$interactiveArea
                    .selectAll('.selected-interval')
                    .remove();
                // store initPos and all initData;
                let mouse = d3.mouse(this);
                initPos = mouse[0];
                initData = getInterpolatedData(initPos);
                // init selection visualization
                $selector = self.$interactiveArea
                    .append("rect")
                    .attr("class", "selected-interval")
                    .attr("x", initPos).attr("y", 0)
                    .attr("width", 0).attr("height", self.height)
                    .attr("fill", fillStyle).attr("stroke", strokeStyle);
                // init tooltip delta-section
                $ttpSection.style("display", "block");
                $ttpSection.selectAll('div')
                    .data(tooltipMetrics).enter()
                    .append("p").attr("class", function (d) { return "delta " + d; });
                // update tooltip vertical position
                let ttpSize = self.$tooltip.node().getBoundingClientRect();
                let yPos = d3.event.pageY - (mouse[1] - self.height / 2) - ttpSize.height / 2;
                self.$tooltip.style("top", yPos + "px");
                return false;
            })
            .on('mousemove.selection', function () {
                if (!self.state.inSelection) { return; }
                let currentPos = d3.mouse(this)[0];
                // calc base metrics' values for tooltip
                let currentData = getInterpolatedData(currentPos);
                // update tooltip
                $ttpSection.selectAll('p')
                    .text(function (d) {
                        let delta = Math.abs(currentData[d] - initData[d]);
                        let format = LabelFormatters[d];
                        return !format ? delta.toFixed(0) : (format.formatter(delta) + format.label);
                    });
                updateSelection(currentPos);
            })
            .on('mouseup.selection', function () {
                let endPos = d3.mouse(this)[0];
                updateSelection(endPos);
                onSelectEnded(endPos);
            })
            .on('mouseout.selection', function () {
                if (!self.state.inSelection) { return; }
                let pos = d3.mouse(this);
                let endPos = pos[0];
                if (endPos < 0) { endPos = 0; }
                else if (endPos > self.width) { endPos = self.width; }
                else if ((pos[1] > 0 && pos[1] < self.height)) { return; }
                updateSelection(endPos);
                onSelectEnded(endPos);
            });
    }

    private createTooltip(): void {
        // create tooltip line, each visible metric's marker and setup tooltip  info panel
        this.addTooltipLine();
        this.setupInfoPanel();
        for (var i = 0; i < this.supportedMetrics.length; i++) {
            this.setupMetricMarkers(this.supportedMetrics[i]);
        }
    }

    private addTooltipLine(): void {
        var self = this;
        this.$interactiveArea
            .append("line")
            .attr("class", 'tooltip_line')
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", 0).attr("y2", this.height)
            .style("stroke", this.activityChartSettings.grid.color)
            .style("stroke-width", this.activityChartSettings.grid.width)
            .style("display", "none");
        this.$interactiveArea
            .on("mousemove.line", function () {
                var pos = d3.mouse(this)[0];
                if (pos > 0 && pos < self.width)
                {
                    d3.selectAll('.tooltip_line')
                        .attr("x1", pos).attr("y1", 0)
                        .attr("x2", pos).attr("y2", self.height)
                        .style("display", "block");
                }
            }).on("mouseover.line", function () {
                d3.selectAll('.tooltip_line').style("display", "block");
            }).on("mouseout.line", function () {
                d3.selectAll('.tooltip_line').style("display", "none");
            });
    }

    private setupInfoPanel(): void {
        let self = this;
        let xOffset = 10;//element(document.getElementsByName('activity-metrics-details')).prop('offsetLeft');
        let domainMetric = ActivityChartMode[this.currentMode];
        let rangeMetric = ActivityChartMode[((this.currentMode === ActivityChartMode.elapsedDuration)
            ? ActivityChartMode.distance
            : ActivityChartMode.elapsedDuration)];
        let domainScale = this.scales[domainMetric].scale;
        let bisect = d3.bisector(function (d) { return d[domainMetric]; }).left; //todo share
        let data = this.chartData.getData();
        this.$interactiveArea
            .on('mouseover.tooltip', function () {
                self.$tooltip.style('display', 'block');
            })
            .on('mouseout.tooltip', function () {
                self.$tooltip.style('display', 'none');
            })
            .on('mousemove.tooltip', function () {
                // get current mouse position
                var mouse = d3.mouse(this);
                var domainValue = domainScale.invert(mouse[0]);
                // found the nearest data index from the dataset
                var index = bisect(data, domainValue);
                if (index < 1 || index >= data.length || !self.isDataDefined(data[index], index)) {
                    self.$tooltip.style('display', 'none');
                    return;
                }
                var startData = data[index - 1];
                var endData = data[index];
                var dataRange = endData[domainMetric] - startData[domainMetric];
                // interpolate value of the dependent metric
                var interpolate = d3.interpolateNumber(startData[rangeMetric], endData[rangeMetric]);
                var rangeValue = interpolate((domainValue % dataRange) / dataRange);
                // update information about the time and distance
                // information about other metrics updated with the related markers
                self.$tooltip.select('.' + domainMetric).text(
                    LabelFormatters[domainMetric].formatter(domainValue) + LabelFormatters[domainMetric].label);
                self.$tooltip.select('.' + rangeMetric).text(
                    LabelFormatters[rangeMetric].formatter(rangeValue) + LabelFormatters[rangeMetric].label);
                let ttpSize = self.$tooltip.node().getBoundingClientRect();
                // calc new tooltip position and move it
                // if there is not enough space on the right side of the tooltip line
                // flip the info panel to the left side
                let leftPos =  self.$window.scrollX + self.$element[0].getBoundingClientRect().left;
                var xPos = (mouse[0] + ttpSize.width + (xOffset + self.activityChartSettings.tooltipOffset) < self.width) ?
                    leftPos + (mouse[0] + (xOffset + self.activityChartSettings.tooltipOffset)) :
                    leftPos + (mouse[0] - (xOffset + self.activityChartSettings.tooltipOffset) - ttpSize.width);
                let topPos = self.$window.scrollY + self.$element[0].getBoundingClientRect().top;
                var yPos = topPos + (self.height - ttpSize.height) / 2;
                self.$tooltip
                    .style("left", xPos + "px")
                    .style("top", yPos + "px")
                    .style("display", "block");
            });
    }

    private setupMetricMarkers(metric: string): void {
        if (!this.chartData.getMeasures()[metric].show) {
            return;
        }
        var settings = this.activityChartSettings[metric].marker;
        var markerId = 'marker' + metric;
        var marker = this.$interactiveArea
            .append('circle')
            .attr("id", markerId)
            .attr('r', settings.radius)
            .style('fill', settings.color)
            .style('display', 'none')
            .style('pointer-events', 'none');
        var ttp = this.$tooltip;
        // todo precreate custom bisector
        var data = this.chartData.getData();
        var domainMetric = ActivityChartMode[this.currentMode];
        var domainScale = this.scales[domainMetric].scale;
        var rangeScale = this.scales[metric].scale;
        var bisect = d3.bisector(function (d) { return d[domainMetric]; }).left;
        let self = this;
        // Add event listeners/handlers
        this.$interactiveArea
            .on('mouseover.' + markerId, function () {
                marker.style('display', 'inherit');
            })
            .on('mouseout.' + markerId, function () {
                marker.style('display', 'none');
            })
            .on('mousemove.' + markerId, function () {
                // imterpolate current metric value and update the marker's position 
                // and the metric's info in tooltip panel
                var mouse = d3.mouse(this);
                var domainValue = domainScale.invert(mouse[0]);
                var index = bisect(data, domainValue);
                if (index < 1 || index >= data.length || !self.isDataDefined(data[index], index)) {
                    marker.style("display", "none");
                    return;
                }
                var startData = data[index - 1];
                var endData = data[index];
                var dataRange = endData[domainMetric] - startData[domainMetric];
                var interpolate = d3.interpolateNumber(startData[metric], endData[metric]);
                var currentData = interpolate((domainValue % dataRange) / dataRange);
                marker
                    .attr('cx', mouse[0])
                    .attr('cy', rangeScale(currentData))
                    .style('display', 'inherit');
                let info = LabelFormatters[metric].formatter(currentData) + LabelFormatters[metric].label;
                ttp.select('.' + metric).text(info);
            });
    }

    private drawGrid(): void {
        let currentWidth = this.width;
        let measures = this.chartData.getMeasures();
        let settings = this.activityChartSettings;
        let areas = this.supportedMetrics
            .filter((a) => { return measures[a].show && settings[a].axis.hideOnWidth < currentWidth; })
            .sort(function (a, b) {
                let orderA = settings[a].order;
                let orderB = settings[b].order;
                return orderA - orderB;
            });
        for (let i = 0; i < areas.length; i++) {
            this.drawRangeAxis(areas[i], i);
        }
        this.drawDomainAxis();
    }

    private drawDomainAxis(): void {
        debugger;
        let metric = ActivityChartMode[this.currentMode];
        let settings = this.activityChartSettings[metric].axis;
        let rangeInfo = this.scales[metric];
        let ticks = this.calcTics(rangeInfo, settings);
        let labelFormatter = LabelFormatters[metric].formatter;
        let xAxis = d3.axisBottom(rangeInfo.scale)
            .tickSizeOuter(0)
            .tickValues(ticks)
            .tickFormat(function (d: number) {
                var pos = ticks.indexOf(d);
                return (pos % settings.ticksPerLabel === 0) ? labelFormatter(d) : '';
            });
        this.$placeholder.select('.activity-chart-grid')
            .append("g")
            .attr("class", "axis-x")
            .attr("transform", "translate(" + this.activityChartSettings.labelOffset + "," + this.height + ")")
            .call(xAxis);
    }

    private drawRangeAxis(metric: string, order: number): void {
        if (!this.chartData.getMeasures()[metric].show) {
            return;
        }
        let rangeInfo = this.scales[metric];
        let isFlipped = this.activityChartSettings[metric].flippedChart;
        let settings = this.activityChartSettings[metric].axis;
        let ticks = this.calcTics(rangeInfo, settings);
        let labelFormatter = LabelFormatters[metric].formatter;
        let yAxis = d3.axisLeft(rangeInfo.scale)
            .tickSize(((!order) ? -this.width : 0))
            .tickValues(ticks)
            .tickFormat(function (d: number) {
                var pos = ticks.indexOf(d);
                return (pos % settings.ticksPerLabel === 0) ? labelFormatter(d) : '';
            });
        let offset = this.activityChartSettings.labelOffset * (order + 1) + this.width * Math.min(order, 1);
        let axis = this.$placeholder.select('.activity-chart-grid')
            .append("g")
            .attr("class", "axis-y-stroke " + metric)
            .attr("transform", "translate(" + offset + ",0)")
            .call(yAxis);
        axis.select(".domain").remove();

        let tickTransitionStep = Math.ceil(this.activityChartSettings.animation.duration / ticks.length);
        let texts = axis.selectAll('text');
        let initBase = isFlipped ? ticks.length : 0;
        // animate label text appearance
        texts
            .style("fill", settings.color)
            .style("fill-opacity", 0)
            .transition()
                .duration(tickTransitionStep)
                .delay(function (d, i) { return tickTransitionStep * Math.abs(initBase - i); })
                .style("fill-opacity", 1);
        // animate tick line appearance from bottom to top
        axis.selectAll('line')
                .style("stroke", 'rgba(0, 0, 0, 0)')
                .transition()
            .duration(tickTransitionStep)
                .delay(function (d, i) { return tickTransitionStep * i; })
                .style("stroke", this.activityChartSettings.grid.color);
    }

    // calculate responsitive ticks for each axis based on current chart size 
    // and specified chart's settings
    private calcTics(rangeInfo, settings): Array<number> {
        let currStep = settings.tickMinStep;
        let currDist = Math.abs(rangeInfo.scale(rangeInfo.min + currStep) -
            rangeInfo.scale(rangeInfo.min + currStep * 2));
        if (currDist < settings.tickMinDistance) {
            currStep = currStep * Math.ceil(settings.tickMinDistance / currDist);
        }
        let tickVals = [];
        let currentTick = (Math.floor(rangeInfo.min / currStep) + 1) * currStep;
        while (currentTick < rangeInfo.max) {
            tickVals.push(currentTick);
            currentTick = currentTick + currStep;
        }
        return tickVals;
    }

    private isDataDefined = (d: any, i: number) => {
        // функция для фильтрации пропущенных участков
        // todo переопределить желаемым условием. Например:
        //return (i % 200 < 150);
        return !!d;
    }

    private getFillColor(areaSettings: IAreaSettings): string {
        switch (areaSettings.fillType) {
            case FillType.Gradient:
                let gradientId = this.getGradient(areaSettings.gradient, areaSettings.heightRatio);
                // absolute url should be used to avoid problems with angular routing and <base> tag
                return "url(" + this.absUrl + "#" + gradientId + ")";
            case FillType.Solid:
                return areaSettings.solidColor;
            default:
                return "none";
        }
    }

    // create new svg gradien based on provided gradient points and max area height
    private getGradient(gradientPoints: Array<IGradientPoint>, heightRation: number): string {
        let index = "lnrGradient" + this.gradientId;
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
            .attr("stop-color", function (d) { return d.color; });
        return index;
    };
}

export default ActivityChartController;