import { IComponentOptions } from 'angular';
import ActivityChartController from "./chart.controller";
import './chart.component.scss';

const ActivityChartComponent: IComponentOptions = {
    controller: ActivityChartController,
    template: require('./chart.component.html') as string,
    bindings: {
        measures: '<',
        data: '<',
        x: '<',
        select: '<',
        change: '<',
        changeMeasure: '<',
        sport: '<',
        onSelected: '&'
    }
};

export default ActivityChartComponent;