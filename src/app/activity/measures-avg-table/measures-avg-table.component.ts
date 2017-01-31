import {IComponentOptions, IComponentController} from 'angular';
import './measures-avg-table.component.scss';
import {IActivityMeasure} from "../../../../api/activity/activity.interface";

class MeasuresAvgTableCtrl implements IComponentController {

    private measures:Array<IActivityMeasure>;
    private sport: string;
    private selected:Array<number> = [];
    private options:Object = {
        rowSelection: false,
        multiSelect: false,
        autoSelect: false,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: false,
        pageSelect: false
    };
    private query:Object = {
        order: 'code',
        limit: 5,
        page: 1
    };

    private filter: Array<string> = ['heartRate', 'speed', 'cadence', 'elevationGain'];

    //static $inject = [''];

    constructor() {
    }

    $onInit() {
        this.measures = this.measures.filter(m => this.filter.indexOf(m.code) !== -1);
        console.log('MeasuresAvgTable=',this.measures);
    }
}

const MeasuresAvgTableComponent:IComponentOptions = {
    bindings: {
        measures: '<',
        sport: '<'
    },
    controller: MeasuresAvgTableCtrl,
    template: require('./measures-avg-table.component.html') as string
};

export default MeasuresAvgTableComponent;