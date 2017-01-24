import {IComponentOptions, IComponentController} from 'angular';
import './measure-split-table.component.scss';
import {IActivityMeasure, IActivityIntervalL} from "../../../../api/activity/activity.interface";

class MeasureSplitTableCtrl implements IComponentController {

    private splits:Array<IActivityIntervalL>;
    private sport: string;
    private selected:Array<number> = [];
    private options:Object = {
        rowSelection: true,
        multiSelect: true,
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

    //private filter: Array<string> = ['heartRate', 'speed', 'cadence', 'elevationGain'];

    //static $inject = [''];

    constructor() {
    }

    $onInit() {
        //this.measures = this.measures.filter(m => this.filter.indexOf(m.code) !== -1);
    }
}

const MeasureSplitTableComponent:IComponentOptions = {
    bindings: {
        splits: '<',
        sport: '<'
    },
    controller: MeasureSplitTableCtrl,
    template: require('./measure-split-table.component.html') as string
};

export default MeasureSplitTableComponent;