import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import './measure-split-table.component.scss';
import {IActivityMeasure, IActivityIntervalL} from "../../../../../api/activity/activity.interface";

class MeasureSplitTableCtrl implements IComponentController {

    public splits:Array<IActivityIntervalL>;
    public sport: string;
    public onSelected: (result: {type: string, selected: Array<number>}) => IPromise<void>;
    public selected:Array<any> = [];
    public max: {};

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
        //this.$scope.selected = [];
        this.$scope.splits = this.splits.map( (d,i) => {
            d['ind'] = i;
            return d;
        });
        this.$scope.change = () => this.onSelected({type: 'L', selected: this.selected.map(i => i.ind)});
        //this.$scope.change = () => console.log('change $scope', this.selected);

    }

    change(){
        //console.log('change', this.selected);
        //this.onSelected({type: 'L', selected: this.selected.map(i => i.ind)});
    }
}

const MeasureSplitTableComponent:IComponentOptions = {
    bindings: {
        splits: '<',
        sport: '<',
        max: '<',
        onSelected: '&'
    },
    controller: MeasureSplitTableCtrl,
    template: require('./measure-split-table.component.html') as string
};

export default MeasureSplitTableComponent;