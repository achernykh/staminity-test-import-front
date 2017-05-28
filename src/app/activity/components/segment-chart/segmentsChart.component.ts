import { IComponentOptions } from 'angular';
import PlanChartController from "./segmentsChart.controller";
import './segmentsChart.component.scss';

const PlanChartComponent: IComponentOptions = {
    controller: PlanChartController,
    template: require('./segmentsChart.component.html') as string,
    bindings: {
        activityHeader: '<',    // intervals info
        select: '<',            // array of selected intervals
        actualFtp: '@',         // false - только план
        planFtp: '@',           // отображать ли плановый % FTP
        durationMeasure: '@',   // отображать по времени или дистанции
        onSelect: '&'           // callback, returns intervals chosen by users
    }
};

export default PlanChartComponent;