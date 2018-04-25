import { element, IComponentController } from "angular";
import * as d3 from "d3";
import {Dispatch} from "d3-dispatch";
import {select} from "d3-selection";
import {measureUnit} from "../../../share/measure/measure.functions";
import "./chart.component.scss";
import { ActivityChartDatamodel } from "./chart.datamodel";
import { ActivityChartMode, FillType, IActivityChartSettings, IAreaSettings, IGradientPoint } from "./settings/settings.models";
import { ChangeTracker } from "./utils/changeTracker";
import { IActivityScales, IScaleInfo, ScaleType } from "./utils/chart.scale";
import LabelFormatters from "./utils/labelFormatter";
import { isPace } from "../../../share/measure/measure.constants";
//import {scale} from 'leaflet';// L.control.scale;
//import scale = L.control.scale;

class ActivityChartController implements IComponentController {

    private config: IActivityChartSettings; // насйтроки графиков по-умолчанию
    private supportedMetrics: string[];

    private measures;
    private data;
    private select;
    private x: string;
    private smooth: number;
    private step: number;
    private changeMeasure: string = null;
    private sport: string;
    private autoZoom: boolean;
    private zoomInClick: number;
    private zoomOutClick: number;
    onSelected: (result: {select: Array<{startTimeStamp: number, endTimeStamp: number}>}) => void;

    private onResize: Function;

    private currentMode: ActivityChartMode;
    private chartData: ActivityChartDatamodel;
    private changeTracker: ChangeTracker;
    private scales: IActivityScales;
    private zoomDispatch: Dispatch<EventTarget>;
    private height: number;
    private width: number;
    private isReady: boolean;

    private $placeholder: any;
    private $interactiveArea: any;
    private $tooltip: any;

    private absUrl: string;
    private gradientId: number = 0;
    private state: {
        // number of items in transition
        inTransition: number,
        inSelection: boolean,
    };

    static $inject = ["$element", "$location", "$window", "activityChartSettings", "$mdMedia"];

    constructor(
        private $element,
        private $location,
        private $window,
        private activityChartSettings: IActivityChartSettings,
        private $mdMedia: any) {

        this.state = { inTransition: 0, inSelection: false };
        this.changeTracker = new ChangeTracker();
    }

    $onInit() {
        this.absUrl = this.$location.absUrl().split("#")[0];
        this.zoomDispatch = d3.dispatch("zoom");
        setTimeout(() => {
            this.prepareData();
            this.prepareConfig();
        }, 100);
    }

    $postLink(): void {
        this.prepareConfig();
        this.$element.ready(() => {
           setTimeout(() => {
                this.isReady = true;
                this.prepareConfig();
                this.preparePlaceholder();
                this.prepareScales();
                this.drawChart();
            }, 300);
        });
        if (this.config.autoResizable) {
            angular.element(this.$window).on("resize", () => this.redraw());
        }
    }

    $onChanges(changes: any): void {
        if (this.changeTracker.isFirstChange(changes)) {
            return;
        }
        console.log(changes);
        if (this.changeTracker.isSelectsOnlyChange(changes)) {
            if (this.changeTracker.areSelectsUpdated(changes)) {
                // redraw only selected intervals
                this.changeTracker.resetUserSelection();
                this.prepareConfig();
                this.prepareData();
                this.drawSelections(0);
                this.zoom(this.autoZoom);
            }
            return;
        }
        if (this.changeTracker.isZoomOnlyChange(changes)) {
            const isZoomIn = this.autoZoom || !!changes.zoomInClick;
            this.zoom(isZoomIn);
            return;
        }
        this.prepareConfig();
        this.prepareData();
        if (this.isReady) {
            this.cleanupPlaceholder();
            this.preparePlaceholder();
            this.prepareScales();
            this.drawChart();
        }
    }

    $onDestroy(): void {
        if (this.config.autoResizable && !!this.onResize) {
            angular.element(this.$window).off("resize", this.onResize);
        }
    }
    
    private prepareConfig (): void {
        this.config = this.activityChartSettings;
        // адаптируем пропорции под размер экрана
        this.config.minAspectRation = (this.$mdMedia("gt-md") && 0.45) ||
            (this.$mdMedia("gt-lg") && 0.35) || this.config.minAspectRation;
        // настраиваем пока двух шкал под два первых активных показателя

    }

    private redraw() {
        if (!!this.$placeholder) {
            this.$placeholder.remove();
        }
        this.preparePlaceholder();
        this.prepareScales();
        // zoom to the selected intervals if in autoZoom mode or zoomInClicked
        if (this.autoZoom || this.zoomInClick) {
            this.zoom(true, false);
        }
        this.drawChart();
    }

    private zoom(isZoomIn: boolean, raiseEvent: boolean = true): void {
        console.log("zoom. IsZoomIn " + isZoomIn + " " + ", raiseEvent: " + raiseEvent);
        let data = null;
        const selectIntervals = this.chartData.getSelect();
        console.log("zoom selectIntervals : " + JSON.stringify(selectIntervals));
        if (isZoomIn && selectIntervals && selectIntervals.length > 0) {
            data = this.chartData.getData();
            // rescale data range to the new intervals
            const unionInterval = {
                startTimestamp: selectIntervals[0].startTimestamp,
                endTimestamp:  selectIntervals[0].endTimestamp,
            };
            for (let i = 1; i < selectIntervals.length; i++) {
                const current = selectIntervals[i];
                if (current.startTimestamp < unionInterval.startTimestamp ) { unionInterval.startTimestamp  = current.startTimestamp; }
                if (current.endTimestamp > unionInterval.endTimestamp ) { unionInterval.endTimestamp  = current.endTimestamp; }
            }
            const tsBisector =  d3.bisector(function(d) { return d["timestamp"]; }).left;
            const startIndex = Math.max(0, tsBisector(data, unionInterval.startTimestamp));
            const endIndex = Math.min(data.length - 1, tsBisector(data, unionInterval.endTimestamp));
            data = data.slice(startIndex, endIndex);
        }
        // update all scales
        for (const metric in this.scales) {
            this.updateScale(metric, data);
        }
        if (raiseEvent) {
            // dispatch zoom event
            this.zoomDispatch.call("zoom");
        }
    }

    private prepareData(): void {
        this.chartData = new ActivityChartDatamodel(this.measures, this.data, this.x, this.select, this.smooth);
        this.currentMode = this.x === "elapsedDuration" ? ActivityChartMode.elapsedDuration : ActivityChartMode.distance;
        this.supportedMetrics = this.chartData.supportedMetrics();
    }

    private preparePlaceholder(): void {
        // calc current chart size based on the conteiner size and chart's settings
        //var bounds = this.$element[0].getBoundingClientRect();
        const parent: Element = angular.element(document).find("activity-metrics-char")[0];

        this.width = parent.clientWidth; //Math.max(bounds.width, this.config.minWidth);
        this.height = parent.clientHeight; //bounds.height;
        //var aspectRatio = this.height / this.width;
        //if (aspectRatio < this.config.minAspectRation) {
            //this.height = this.width * this.config.minAspectRation;
        //}
        const container = d3.select(this.$element[0]);
        // create root svg placeholder
        this.$placeholder = container
            .append("svg")
            .attr("class", "activity-chart")
            .attr("width", this.width)
            .attr("height", this.height);
        // calc axis offsets based on metrics visability and chart settings
        const labelOffset = this.config.labelOffset;
        const visibleAxis = this.supportedMetrics.filter((a) => {
            return this.chartData.getMeasures()[a].show &&
                this.config[a].axis.hideOnWidth < this.width;
        });
        // update information about the chart area size
        this.width = this.width - visibleAxis.length * labelOffset;
        this.height = this.height - labelOffset;
        this.$placeholder.append("g").attr("class", "activity-chart-grid");
        // append svg group for chart interactive area (main area withoud axis)
        this.$interactiveArea = this.$placeholder
            .append("g")
            .attr("class", "chart-interactive-area")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("transform", "translate(" + labelOffset + ",0)");
        // append transparent rectangle to ensure onmouse events
        this.$interactiveArea.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "rgba(1, 1, 1, 0)");

        // store link to the tooltip template
        this.$tooltip = container.select(".tooltip");
    }

    private prepareScales(): void {
        // precalculate and cache chart scales for all metrics
        this.scales = {
            elapsedDuration: this.getScale("elapsedDuration", ScaleType.X),
            duration: this.getScale("duration", ScaleType.X),
            distance: this.getScale("distance", ScaleType.X),
            speed: this.getScale("speed", ScaleType.Y),
            power: this.getScale("power", ScaleType.Y),
            heartRate: this.getScale("heartRate", ScaleType.Y),
            cadence: this.getScale("cadence", ScaleType.Y),
            strokes: this.getScale("strokes", ScaleType.Y),
            altitude: this.getScale("altitude", ScaleType.Y),
        };
    }

    private getScale(metric: string, type: ScaleType): IScaleInfo {
        const min = +d3.min(this.chartData.getData(), function(d) { return d[metric]; });
        const max = +d3.max(this.chartData.getData(), function(d) { return d[metric]; });
        const settingsMetric = isPace(measureUnit(metric, this.sport)) ? "pace" : metric;
        const settings = this.config[settingsMetric];
        let range;
        if (type === ScaleType.X) {
            range = [0, this.width];
        } else {
            const heightRatio = settings.area.heightRatio;
            range = [this.height, this.height * (1 - heightRatio)];
        }
        const domain = (settings.flippedChart) ? [max, min] : [min, max];
        const scale = d3.scaleLinear()
            .range(range)
            .domain(domain);
        const info: IScaleInfo = {
            type,
            min,
            max,
            originMin: min,
            originMax: max,
            scale,
        };
        return info;
    }

    private updateScale(metric: string, currentData): void {
        const settingsMetric = isPace(measureUnit(metric, this.sport)) ? "pace" : metric;
        const settings = this.config[settingsMetric];
        const scaleInfo = this.scales[metric];
        // by default reset to origin size
        let min = scaleInfo.originMin;
        let max = scaleInfo.originMax;
        // if scaled data subset not null recalculate domain
        if (currentData && currentData.length) {
            min = -settings.zoomOffset + d3.min(currentData, function(d) { return d[metric]; });
            max = settings.zoomOffset + d3.max(currentData, function(d) { return d[metric]; });
            if (scaleInfo.type === ScaleType.X) {
                min = Math.max(min, scaleInfo.originMin);
                max = Math.min(max, scaleInfo.originMax);
            }
        }
        const domain = (settings.flippedChart) ? [max, min] : [min, max];
        scaleInfo.scale.domain(domain);
        scaleInfo.min = min;
        scaleInfo.max = max;
    }

    private cleanupPlaceholder(): void {
        this.$interactiveArea.remove();
        this.$placeholder.remove();
    }

    private drawChart(): void {
        const settings = this.config;
        const areas = this.supportedMetrics
            .filter((a) => this.chartData.getMeasures()[a].show)
            .sort(function(a, b) {
                const orderA = settings[a].order;
                const orderB = settings[b].order;
                return orderB - orderA;
            });
        // remove all previous zoom callbacks
        this.zoomDispatch.on("zoom", null);
        // draw new chart
        this.drawGrid(areas);
        this.drawMetricAreas(areas);
        this.drawSelections(areas.length);
        this.createTooltip();
        this.setupUserSelections();
    }

    private drawMetricAreas(areas): void {
        // append clipPath
        // append clip Path for zooming
        this.$interactiveArea.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height);
        // draw chart areas for all visible metrics
        // in order specified in chart settings
        const metrics = this.chartData.getData();
        this.$interactiveArea.datum(metrics);
        for (let i = 0; i < areas.length; i++) {
            this.drawMetricArea(areas[i], i);
        }
    }

    private drawMetricArea(metric: string, order: number = 0): void {
        const state = this.state;
        const domainMetric = ActivityChartMode[this.currentMode];
        const domainScale = this.scales[domainMetric].scale;
        const rangeScale = this.scales[metric].scale;
        const fillColor = this.getFillColor(this.config[metric].area);
        const lineColor = this.config[metric].area.lineColor;
        const lineWidth = this.config[metric].area.lineWidth;
        const bottomRange = this.height;
        const data = this.chartData;

        const areaFunction = d3.area()
            .defined((d,i) => this.isDataDefined(d,i,metric))
            .x(function(d) { return domainScale(d[domainMetric]); })
            .y0(function() { return bottomRange; })
            .y1(function(d) { return rangeScale(d[metric]); })
            .curve(d3.curveBasis);

        const lineFunction = d3.line()
            .defined((d,i) => this.isDataDefined(d,i,metric))
            .x(function(d) { return domainScale(d[domainMetric]); })
            .y(function(d) { return rangeScale(d[metric]); })
            .curve(d3.curveBasis);

        const initArea = d3.area()
            .defined((d,i) => this.isDataDefined(d,i,metric))
            .x(function(d) { return domainScale(d[domainMetric]); })
            .y0(function() { return bottomRange; })
            .y1(function() { return bottomRange; })
            .curve(d3.curveBasis);

        const initLine = d3.line()
            .defined((d,i) => this.isDataDefined(d,i,metric))
            .x(function(d) { return domainScale(d[domainMetric]); })
            .y(function(d) { return rangeScale(d[metric]); })
            .curve(d3.curveBasis);

        const metricChart = this.$interactiveArea
            .append("path")
                .attr("d", initArea)
                .attr("fill", fillColor);

        const metricLine = this.$interactiveArea
            .append("path")
                .attr("d", initLine)
                .attr("fill", 'none')
                .attr('stroke', lineColor)
                .attr('stroke-width', lineWidth);

        metricChart
            .transition()
                .on("start", function() { state.inTransition++; })
                .on("end", function() { state.inTransition--; })
                .delay(order * this.config.animation.delayByOrder)
                .duration(this.config.animation.duration)
                .ease(this.config.animation.ease)
                .attr("d", areaFunction);

        metricLine
            .transition()
            .on("start", function() { state.inTransition++; })
            .on("end", function() { state.inTransition--; })
            .delay(order * this.config.animation.delayByOrder)
            .duration(this.config.animation.duration)
            .ease(this.config.animation.ease)
            .attr("d", lineFunction);

        const zoomDuration = this.config.animation.zoomDuration;
        // setup zoom event
        this.zoomDispatch.on("zoom." + metric, function() {
            metricChart
                .transition()
                .duration(zoomDuration)
                .attr("d", areaFunction);

            metricLine
                .transition()
                .duration(zoomDuration)
                .attr("d", lineFunction);
        });
    }

    private drawSelections(areasTotal: number): void {
        const state = this.state;
        this.$interactiveArea.selectAll(".selected-interval").remove();
        this.$interactiveArea.selectAll(".select-resize-handler").remove();
        const domain = ActivityChartMode[this.currentMode];
        const fillStyle = this.getFillColor(this.config.selectedArea.area);
        const strokeStyle = this.getFillColor(this.config.selectedArea.borderArea);
        const tsBisector =  d3.bisector(function(d) { return d["timestamp"]; }).left;
        const xScale = this.scales[domain].scale;
        const data = this.chartData.getData();
        const selectIntervals = this.chartData.getSelect();
        // create select interval bars
        const clipPathUrl = "url(" + this.absUrl + "#clip)";
        this.$interactiveArea
                .selectAll(".selected-interval")
                .data(selectIntervals).enter()
            .append("rect")
                .attr("class", "selected-interval")
                .attr("clip-path", clipPathUrl)
                .attr("x", function(d) {
                    const startIndex = Math.max(0, tsBisector(data, d.startTimestamp));
                    return xScale(data[startIndex][domain]);
                })
                .attr("y", this.height)
                .attr("width", function(d) {
                    const startIndex = Math.max(0, tsBisector(data, d.startTimestamp));
                    const endIndex = Math.min(data.length - 1, tsBisector(data, d.endTimestamp));
                    const start = xScale(data[startIndex][domain]);
                    const end = xScale(data[endIndex][domain]);
                    return (end - start);
                })
                .attr("fill", fillStyle)
                .attr("stroke", strokeStyle)
            .transition()
                .on("start", function() { state.inTransition++; })
                .on("end", function() { state.inTransition--; })
                .delay(this.config.animation.duration * areasTotal)
                .duration(this.config.animation.duration)
                .ease(this.config.animation.ease)
                .attr("y", 0).attr("height", this.height);

        // add on-zoom update callback
        const self = this;
        this.zoomDispatch.on("zoom.selections", function() {
            // update every select area with new width $ x-position
            self.$interactiveArea
                .selectAll(".selected-interval")
                .attr("x", function(d) {
                    const startIndex = Math.max(0, tsBisector(data, d.startTimestamp));
                    return xScale(data[startIndex][domain]);
                })
                .attr("width", function(d) {
                    const startIndex = Math.max(0, tsBisector(data, d.startTimestamp));
                    const endIndex = Math.min(data.length - 1, tsBisector(data, d.endTimestamp));
                    const start = xScale(data[startIndex][domain]);
                    const end = xScale(data[endIndex][domain]);
                    return (end - start);
                });

            // update select resize handles as well
            self.$interactiveArea
                .selectAll(".select-resize-handler")
                .attr("x", function(d) {
                    const startIndex = Math.max(0, tsBisector(data, d.timestamp));
                    const pos = Math.max(0, xScale(data[startIndex][domain]) - 2);
                    return pos;
                });
        });
    }

    private setupUserSelections(): void {
        const data = this.chartData.getData();
        const domain = ActivityChartMode[this.currentMode];
        const fillStyle = this.getFillColor(this.config.selectedArea.area);
        const strokeStyle = this.getFillColor(this.config.selectedArea.borderArea);
        const xScale = this.scales[domain].scale;

        // Setup range metrics data interpolation function
        const bisect = d3.bisector(function(d) { return d[domain]; }).left;
        const baseMetrics = this.chartData.getBaseMetrics();
        const tooltipMetrics = this.chartData.getBaseMetrics(["timestamp", "duration"]);
        const getInterpolatedData = function(pos: number): { [id: string]: number } {
            const domainValue = xScale.invert(pos);
            let index = bisect(data, domainValue);
            index = Math.min(data.length - 1, Math.max(1, index));
            const startData = data[index - 1];
            const endData = data[index];
            const dataRange = endData[domain] - startData[domain];
            const interpolatedData = {};
            // interpolate value of all base metrics
            for (let i = 0; i < baseMetrics.length; i++) {
                const metric = baseMetrics[i];
                if (metric === domain) {
                    interpolatedData[metric] = domainValue;
                    continue;
                }
                const interpolate = d3.interpolateNumber(startData[metric], endData[metric]);
                const metricValue = interpolate((domainValue % dataRange) / dataRange);
                interpolatedData[metric] = metricValue;
            }
            return interpolatedData;
        };

        // Add event listeners for user selection action
        // and store initial measure values for optimisation purpose
        const self = this;
        let initPos = null;
        let initData = {};
        let $selection = null;
        const $ttpSection = this.$tooltip.select(".deltas");

        const updateSelection = function(current: number): void {
            if (!self.state.inSelection) {
                return;
            }
            const x = Math.min(current, initPos);
            const width = Math.abs(current - initPos);
            $selection.attr("x", x).attr("width", width);
        };

        const endSelection = function(endPos: number): void {
            self.$interactiveArea.attr("cursor", "default");
            if (!self.state.inSelection) {
                return;
            }
            self.state.inSelection = false;
            // remove delta section from the tooltip
            $ttpSection.selectAll("*").remove();
            $ttpSection.style("display", "none");
            // calculate final interval selected by user
            let intervals = [];
            if (endPos !== initPos) {
                const endData = getInterpolatedData(endPos);
                const endTimestamp = Math.round(endData["timestamp"]);
                const startTimestamp = Math.round(initData["timestamp"]);
                // swap endTimestamp and startTimestamp in case of user selected the interval from right to left
                intervals = endTimestamp > startTimestamp ?
                    [{ "startTimestamp": startTimestamp, "endTimestamp": endTimestamp }] :
                    [{ "startTimestamp": endTimestamp, "endTimestamp": startTimestamp }];
                // add handlers to the start and the end of the user selection area
                self.addResizeHandlers([
                    { timestamp: startTimestamp, initPos} ,
                    { timestamp: endTimestamp, initPos: endPos}]);
            }
            // update local information about chosen intervals
            self.$interactiveArea.selectAll(".selected-interval").data(intervals);
            self.changeTracker.storeUserSelection(intervals);
            self.chartData.setSelect(intervals);
            if (self.autoZoom) {
                self.zoom(self.autoZoom);
            }
            // rise onSelected event
            self.onSelected({ select: intervals });
        };
        // add listeners to the user selection block
        if (this.changeTracker.isUserSelection(this.select)) {
            $selection = this.$interactiveArea.select(".selected-interval");
            const from = +$selection.attr("x");
            const till = from + parseInt($selection.attr("width"));
            this.addResizeHandlers([
                { timestamp: this.select[0].startTimestamp, initPos: from} ,
                { timestamp: this.select[0].endTimestamp, initPos: till }]);
        }
        //interpolate timestamp from selected value
        const clipPathUrl = "url(" + this.absUrl + "#clip)";
        this.$interactiveArea
            .on("mousedown.selection", function() {
                const mouse = d3.mouse(this);
                // init new selection
                if (!self.state.inSelection) {
                    self.state.inSelection = true;
                    // remove previously selected areas
                    self.$interactiveArea.selectAll(".selected-interval").remove();
                    self.$interactiveArea.selectAll(".select-resize-handler").remove();
                    // store initPos;
                    initPos = mouse[0];
                    // init selection visualization
                    $selection = self.$interactiveArea
                        .append("rect")
                            .attr("class", "selected-interval")
                            .attr("clip-path", clipPathUrl)
                            .attr("x", initPos).attr("y", 0)
                            .attr("width", 0).attr("height", self.height)
                            .attr("fill", fillStyle)
                            .attr("stroke", strokeStyle);
                } else {
                    // update init position for correct selection resize
                    const start = +$selection.attr("x");
                    const end = +$selection.attr("width") + start;
                    initPos = (Math.abs(start - mouse[0]) > Math.abs(end - mouse[0])) ? start : end;
                }
                //change cursor to the resize view
                self.$interactiveArea.attr("cursor", "col-resize");
                // store init data for toolip delta section
                initData = getInterpolatedData(initPos);
                // init tooltip delta-section
                $ttpSection.selectAll("div")
                    .data(tooltipMetrics).enter()
                    .append("p").attr("class", function(d) { return "delta " + d; });
                // update tooltip vertical position
                const ttpSize = self.$tooltip.node().getBoundingClientRect();
                const yPos = d3.event.pageY - (mouse[1] - self.height / 2) - ttpSize.height / 2;
                self.$tooltip.style("top", yPos + "px");
            })
            .on("mousemove.selection", function() {
                if (!self.state.inSelection) { return; }
                const currentPos = d3.mouse(this)[0];
                if (currentPos === initPos) {
                    $ttpSection.style("display", "none");
                } else {
                    // calc base metrics' values for tooltip
                    const currentData = getInterpolatedData(currentPos);
                    // update tooltip
                    $ttpSection.style("display", "block");
                    $ttpSection.selectAll("p")
                        .text(function(d) {
                            const delta = Math.abs(currentData[d] - initData[d]);
                            const format = LabelFormatters[d];
                            return !format ? delta.toFixed(0) : (format.formatter(delta, self.sport) + format.label(self.sport));
                        });
                }
                updateSelection(currentPos);
            })
            .on("mouseup.selection", function() {
                const endPos = d3.mouse(this)[0];
                updateSelection(endPos);
                endSelection(endPos);
            })
            .on("mouseout.selection", function() {
                if (!self.state.inSelection) { return; }
                const pos = d3.mouse(this);
                let endPos = pos[0];
                if (endPos < 0) { endPos = 0; } else if (endPos > self.width) { endPos = self.width; } else if ((pos[1] > 0 && pos[1] < self.height)) { return; }
                updateSelection(endPos);
                endSelection(endPos);
            });
    }

    private addResizeHandlers(data: Array<{initPos: number, timestamp: number}>): void {
        const self = this;
        this.$interactiveArea
            .selectAll(".select-resize-handler")
            .data(data).enter()
            .append("rect")
                .attr("class", "select-resize-handler")
                .attr("x", function(d) { return d.initPos - 2; })
                .attr("width", 4)
                .attr("y", 0).attr("height", this.height)
                .style("cursor", "col-resize").style("fill", "rgba(1, 1, 1, 0)")
            .on("mousedown", function() {
                // change current state to the "in selection"
                self.state.inSelection = true;
                // remove all resize handlers
                self.$interactiveArea
                    .selectAll(".select-resize-handler")
                    .remove();
            });
    }

    private createTooltip(): void {
        // create tooltip line, each visible metric's marker and setup tooltip  info panel
        this.addTooltipLine();
        this.setupInfoPanel();
        for (let i = 0; i < this.supportedMetrics.length; i++) {
            this.setupMetricMarkers(this.supportedMetrics[i]);
        }
    }

    private addTooltipLine(): void {
        const self = this;
        this.$interactiveArea
            .append("line")
            .attr("class", "tooltip_line")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", 0).attr("y2", this.height)
            .style("stroke", this.config.grid.color)
            .style("stroke-width", this.config.grid.width)
            .style("display", "none");
        this.$interactiveArea
            .on("mousemove.line", function() {
                const pos = d3.mouse(this)[0];
                if (pos > 0 && pos < self.width) {
                    d3.selectAll(".tooltip_line")
                        .attr("x1", pos).attr("y1", 0)
                        .attr("x2", pos).attr("y2", self.height)
                        .style("display", "block");
                }
            }).on("mouseover.line", function() {
                d3.selectAll(".tooltip_line").style("display", "block");
            }).on("mouseout.line", function() {
                d3.selectAll(".tooltip_line").style("display", "none");
            });
    }

    private setupInfoPanel(): void {
        const self = this;
        const xOffset = 10;
        const domainMetric = ActivityChartMode[this.currentMode];
        const rangeMetric = ActivityChartMode[((this.currentMode === ActivityChartMode.elapsedDuration)
            ? ActivityChartMode.distance
            : ActivityChartMode.elapsedDuration)];
        const domainScale = this.scales[domainMetric].scale;
        const bisect = d3.bisector(function(d) { return d[domainMetric]; }).left; //todo share
        const data = this.chartData.getData();
        this.$interactiveArea
            .on("mouseover.tooltip", function() {
                self.$tooltip.style("display", "block");
            })
            .on("mouseout.tooltip", function() {
                self.$tooltip.style("display", "none");
            })
            .on("mousemove.tooltip", function() {
                // get current mouse position
                const mouse = d3.mouse(this);
                const domainValue = domainScale.invert(mouse[0]);
                // found the nearest data index from the dataset
                const index = bisect(data, domainValue);
                if (index < 1 || index >= data.length || !self.isDataDefined(data[index], index)) {
                    self.$tooltip.style("display", "none");
                    return;
                }
                const startData = data[index - 1];
                const endData = data[index];
                const dataRange = endData[domainMetric] - startData[domainMetric];
                // interpolate value of the dependent metric
                const interpolate = d3.interpolateNumber(startData[rangeMetric], endData[rangeMetric]);
                const rangeValue = interpolate((domainValue % dataRange) / dataRange);
                // update information about the time and distance
                // information about other metrics updated with the related markers
                self.$tooltip.select("." + domainMetric).text(
                    LabelFormatters[domainMetric].formatter(domainValue, self.sport) + LabelFormatters[domainMetric].label(self.sport));
                self.$tooltip.select("." + rangeMetric).text(
                    LabelFormatters[rangeMetric].formatter(rangeValue, self.sport) + LabelFormatters[rangeMetric].label(self.sport));
                const ttpSize = self.$tooltip.node().getBoundingClientRect();
                // calc new tooltip position and move it
                // if there is not enough space on the right side of the tooltip line
                // flip the info panel to the left side
                const leftPos =  self.$window.scrollX + self.$element[0].getBoundingClientRect().left;
                const xPos = (mouse[0] + ttpSize.width + (xOffset + self.activityChartSettings.tooltipOffset) < self.width) ?
                    leftPos + (mouse[0] + (xOffset + self.activityChartSettings.tooltipOffset)) :
                    leftPos + (mouse[0] - (xOffset + self.activityChartSettings.tooltipOffset) - ttpSize.width);
                const topPos = self.$window.scrollY + self.$element[0].getBoundingClientRect().top;
                const yPos = topPos + (self.height - ttpSize.height) / 2;
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
        const settings = this.config[metric].marker;
        const markerId = "marker" + metric;
        const marker = this.$interactiveArea
            .append("circle")
            .attr("id", markerId)
            .attr("r", settings.radius)
            .style("fill", settings.color)
            .style("display", "none")
            .style("pointer-events", "none");
        const ttp = this.$tooltip;
        // todo precreate custom bisector
        const data = this.chartData.getData();
        const domainMetric = ActivityChartMode[this.currentMode];
        const domainScale = this.scales[domainMetric].scale;
        const rangeScale = this.scales[metric].scale;
        const bisect = d3.bisector(function(d) { return d[domainMetric]; }).left;
        const self = this;
        // Add event listeners/handlers
        this.$interactiveArea
            .on("mouseover." + markerId, function() {
                marker.style("display", "inherit");
            })
            .on("mouseout." + markerId, function() {
                marker.style("display", "none");
            })
            .on("mousemove." + markerId, function() {
                // imterpolate current metric value and update the marker's position
                // and the metric's info in tooltip panel
                const mouse = d3.mouse(this);
                const domainValue = domainScale.invert(mouse[0]);
                const index = bisect(data, domainValue);
                if (index < 1 || index >= data.length || !self.isDataDefined(data[index], index)) {
                    marker.style("display", "none");
                    return;
                }
                const startData = data[index - 1];
                const endData = data[index];
                const dataRange = endData[domainMetric] - startData[domainMetric];
                const interpolate = d3.interpolateNumber(startData[metric], endData[metric]);
                const currentData = interpolate((domainValue % dataRange) / dataRange);
                marker
                    .attr("cx", mouse[0])
                    .attr("cy", rangeScale(currentData))
                    .style("display", "inherit");
                const info = LabelFormatters[metric].formatter(currentData, self.sport); //+ LabelFormatters[metric].label(self.sport);
                ttp.select("." + metric + " span.value").text(info);
            });
    }

    private drawGrid(areas): void {
        let axisOrder = 0;
        for (let i = 0; i < areas.length; i++) {
            const area = areas[i];
            if (this.config[area].axis.hideOnWidth < this.width) {
                this.drawRangeAxis(area, axisOrder, i);
                axisOrder++;
            }
        }
        this.drawDomainAxis();
    }

    private drawDomainAxis(): void {
        const metric = ActivityChartMode[this.currentMode];
        const settings = this.config[metric].axis;
        const rangeInfo = this.scales[metric];
        const ticks = this.calcTics(rangeInfo, settings);
        const labelFormatter = LabelFormatters[metric].formatter;
        const xAxis = d3.axisBottom(rangeInfo.scale)
            .tickSizeOuter(0)
            .tickValues(ticks)
            .tickFormat((d: number) => {
                const pos = ticks.indexOf(d);
                return (pos % settings.ticksPerLabel === 0) ? labelFormatter(d, this.sport) : "";
            });
        this.$placeholder.select(".activity-chart-grid")
            .append("g")
            .attr("class", "axis-x")
            .attr("transform", "translate(" + this.config.labelOffset + "," + this.height + ")")
            .call(xAxis);

        // add on-zoom rescale callback
        const self = this;
        const zoomDuration = this.config.animation.zoomDuration;
        this.zoomDispatch.on("zoom.domainAxis", function() {
            // recalculate ticks for new metric's range
            const scaledTicks = self.calcTics(rangeInfo, settings);
            xAxis.tickValues(scaledTicks);
            // rescale domain axis
            self.$placeholder.select(".axis-x")
                .transition()
                .duration(zoomDuration)
                .call(xAxis);
        });
    }

    private drawRangeAxis(metric: string, order: number, animationOrder: number): void {
        const rangeInfo = this.scales[metric];
        const settingsMetric = isPace(measureUnit(metric, this.sport)) ? "pace" : metric;
        const isFlipped = this.config[settingsMetric].flippedChart;
        const settings = this.config[settingsMetric].axis;
        //debugger;
        const ticks = this.calcTics(rangeInfo, settings);
        const labelFormatter = LabelFormatters[metric].formatter;
        const yAxis = d3.axisLeft(rangeInfo.scale)
            .tickSize(((!order) ? -this.width : 0))
            .tickValues(ticks)
            .tickFormat((d: number) => {
                const pos = ticks.indexOf(d);
                return (pos % settings.ticksPerLabel === 0) ? labelFormatter(d, this.sport) : "";
            });
        const offset = this.config.labelOffset * (order + 1) + this.width * Math.min(order, 1);
        const axis = this.$placeholder.select(".activity-chart-grid")
            .append("g")
            .attr("class", "axis-y-stroke " + metric)
            .attr("transform", "translate(" + offset + ",0)")
            .call(yAxis);
        axis.select(".domain").remove();

        const tickTransitionStep = Math.ceil(this.config.animation.duration / ticks.length);
        const texts = axis.selectAll("text");
        const initBase = isFlipped ? ticks.length : 0;
        // animate label text appearance
        const baseDelay = animationOrder * this.config.animation.delayByOrder;
        texts
            .style("fill", settings.color)
            .style("fill-opacity", 0)
            .transition()
                .duration(tickTransitionStep)
                .delay(function(d, i) { return baseDelay + tickTransitionStep * Math.abs(initBase - i); })
                .style("fill-opacity", 1);
        // animate tick line appearance from bottom to top
        axis.selectAll("line")
                .style("stroke", "rgba(0, 0, 0, 0)")
                .transition()
            .duration(tickTransitionStep)
                .delay(function(d, i) { return baseDelay + tickTransitionStep * i; })
                .style("stroke", this.config.grid.color);

        // add on-zoom rescale callback
        const self = this;
        const zoomDuration = this.config.animation.zoomDuration;
        this.zoomDispatch.on("zoom.rangeAxis" + metric , function() {
            // recalculate ticks for new metric's range
            const scaledTicks = self.calcTics(rangeInfo, settings);
            yAxis.tickValues(scaledTicks);
            // rescale range axis of the metric
            axis
                .transition()
                .duration(zoomDuration)
                .call(yAxis);
            // update color for new labels
            axis.selectAll("text").style("fill", settings.color);
        });
    }

    // calculate responsitive ticks for each axis based on current chart size
    // and specified chart's settings
    private calcTics(rangeInfo, settings): number[] {
        let currStep = settings.multiplex && settings.tickMinStep(this.sport) ||
            (settings.tickMinStep === 1 && Math.abs(rangeInfo.max - rangeInfo.min) < settings.tickMinStep * settings.ticksPerLabel * 4 && settings.tickMinStep / 2) ||
            (settings.tickMinStep === 5 && Math.abs(rangeInfo.max - rangeInfo.min) < settings.tickMinStep * settings.ticksPerLabel * 4 && settings.tickMinStep / 5) ||
            settings.tickMinStep; // metrics unit
        const currDist = Math.abs(rangeInfo.scale(rangeInfo.min + currStep) -
            rangeInfo.scale(rangeInfo.min + currStep * 2)); // дистанция в ?
        if (currDist < settings.tickMinDistance) {
            currStep = currStep * Math.ceil(settings.tickMinDistance / currDist);
        }
        const tickVals = [];
        let currentTick = (Math.floor(rangeInfo.min / currStep) + 1) * currStep;
        while (currentTick < rangeInfo.max) {
            tickVals.push(settings.multiplex && settings.multiplex(currentTick, this.sport) || currentTick);
            //tickVals.push(Math.ceil(currentTick * 100 / settings.tickMinStep) * settings.tickMinStep / 100 );
            currentTick = currentTick + currStep;
        }
        return tickVals;
    }

    private isDataDefined = (d: any, i: number, param?: string) => {
        // функция для фильтрации пропущенных участков
        // todo переопределить желаемым условием. Например:
        //return (i % 200 < 150);
        //console.log('isDataDefined', d,i);
        //return !!d;
        //return d > 0;
        //debugger;
        //return i !== 0 && (d['elapsedDuration'] - this.chartData.getData(i-1)['elapsedDuration']) <= 10;
        //return d['speed'] !== 1000;

        /**console.debug('data:',
            i,
            d && d.pause,
            d && d.elapsedDuration,
            i !== 0 && this.chartData.getData(i - 1) && this.chartData.getData(i - 1).elapsedDuration,
            d && d.duration,
            i !== 0 && this.chartData.getData(i - 1) && this.chartData.getData(i - 1).duration,
            d.power,
            d.speed,
            d.cadence,
            d.heartRate);**/

        if (param && !d[param]) { return false;}
        if (i === 0) { return true;}

        return !d.pause &&
            (this.smooth === 0 || (d.elapsedDuration - this.chartData.getData(i - 1).elapsedDuration <= this.chartData.smooth * Math.ceil(this.step * 5)));
        /*return i !== 0 && this.chartData.getData(i - 1) &&
            (d.elapsedDuration > this.chartData.getData(i - 1).elapsedDuration) &&
            (this.smooth === 0 || (d.elapsedDuration - this.chartData.getData(i - 1).elapsedDuration <= Math.max(this.chartData.smooth * 5, 15))) &&
            (d.duration > this.chartData.getData(i - 1).duration);*/
    }

    private getFillColor(areaSettings: IAreaSettings): string {
        switch (areaSettings.fillType) {
            case FillType.Gradient:
                const gradientId = this.getGradient(areaSettings.gradient, areaSettings.heightRatio);
                // absolute url should be used to avoid problems with angular routing and <base> tag
                return "url(" + this.absUrl + "#" + gradientId + ")";
            case FillType.Solid:
                return areaSettings.solidColor;
            default:
                return "none";
        }
    }

    // create new svg gradient based on provided gradient points and max area height
    private getGradient(gradientPoints: IGradientPoint[], heightRation: number): string {
        const index = "lnrGradient" + this.gradientId;
        this.gradientId = this.gradientId + 1;
        this.$placeholder.append("linearGradient")
            .attr("id", index)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", (100 * (1 - heightRation) + "%"))
            .attr("x2", 0).attr("y2", "100%")
            .selectAll("stop")
            .data(gradientPoints)
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; })
            .attr("stop-opacity", function(d) { return d.opacity; }); // fix for Safari
        return index;
    };
}

export default ActivityChartController;
