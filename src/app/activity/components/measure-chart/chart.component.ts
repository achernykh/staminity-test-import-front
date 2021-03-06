﻿import { IComponentOptions } from "angular";
import "./chart.component.scss";
import ActivityChartController from "./chart.controller";

const ActivityChartComponent: IComponentOptions = {
    controller: ActivityChartController,
    template: require("./chart.component.html") as string,
    bindings: {
        measures: "<",
        data: "<",
        x: "<",
        smooth: '<',
        select: "<",
        change: "<",
        changeMeasure: "<",
        sport: "<",
        step: "<", // средний шаг между elapsedDuration (без учета пауз и остановок)
        autoZoom: "<",
        zoomInClick: "<",
        zoomOutClick: "<",
        onSelected: "&",
    },
};

export default ActivityChartComponent;
