import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import './measure-split-table.component.scss';
import {IActivityMeasure, IActivityIntervalL} from "../../../../api/activity/activity.interface";

class MeasureSplitTableCtrl implements IComponentController {

    public splits:Array<IActivityIntervalL>;
    public sport: string;
    public onSelected: (result: {selected: Array<{startTimeStamp: number, endTimeStamp:number}>}) => IPromise<void>;
    public selected:Array<any> = [];

    public options:Object = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
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

    static $inject = ['$scope'];

    constructor(private $scope: any) {
    }

    $onInit() {
        //this.measures = this.measures.filter(m => this.filter.indexOf(m.code) !== -1);
        this.$scope.selected = [];
        this.$scope.splits = this.splits;
        this.$scope.change = () => this.onSelected({
                selected: this.selected.map(i => ({startTimeStamp: i.startTimestamp,endTimeStamp: i.endTimestamp}))
            });
    }
}

const MeasureSplitTableComponent:IComponentOptions = {
    bindings: {
        splits: '<',
        sport: '<',
        onSelected: '&'
    },
    controller: MeasureSplitTableCtrl,
    template: require('./measure-split-table.component.html') as string
};

export default MeasureSplitTableComponent;