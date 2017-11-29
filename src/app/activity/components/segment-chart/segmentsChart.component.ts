import { IComponentOptions } from "angular";
import "./segmentsChart.component.scss";
import PlanChartController from "./segmentsChart.controller";

const PlanChartComponent: IComponentOptions = {
    controller: PlanChartController,
    template: require("./segmentsChart.component.html") as string,
    bindings: {
        activityHeader: "<",    // intervals info
        select: "<",            // array of selected intervals
        actualFtp: "<",         // false - только план
        planFtp: "<",           // отображать ли плановый % FTP
        durationMeasure: "<",   // отображать по времени или дистанции
        view: "<",              // формат отображения mobile / desktop, влияет на aspectRatio
        change: "<",            // индикатор изменения данных activityHeader
        onSelect: "&",           // callback, returns intervals chosen by users
    },
};

export default PlanChartComponent;