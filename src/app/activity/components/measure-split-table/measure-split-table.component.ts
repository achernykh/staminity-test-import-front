import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import './measure-split-table.component.scss';
import {IActivityMeasure, IActivityIntervalL} from "../../../../../api/activity/activity.interface";
import {
    SelectInitiator,
    ISelectionIndex
} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";

class MeasureSplitTableCtrl implements IComponentController {

    public splits:Array<IActivityIntervalL>;
    public sport: string;
    public onSelected: (result: {initiator: SelectInitiator, selection: ISelectionIndex}) => IPromise<void>;
    public selected:Array<any> = [];
    public max: {};
    public zones: any;

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
        this.$scope.splits = this.splits.filter(i => i.type === 'L').map( (d,i) => {
            d['ind'] = i;
            return d;
        });
        this.$scope.change = () => this.onSelected({
            initiator: 'splits',
            selection: {
                U: null,
                P: null,
                L: this.selected.map(i => i.ind)}
        });
        //this.$scope.change = () => console.log('change $scope', this.selected);

    }

    getFTP(factor: string, sport: string = this.sport):number {
        return (this.zones[factor].hasOwnProperty(sport) && this.zones[factor][sport]['FTP']) ||
            this.zones[factor]['default']['FTP'];
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
        zones: '<',
        onSelected: '&'
    },
    controller: MeasureSplitTableCtrl,
    template: require('./measure-split-table.component.html') as string
};

export default MeasureSplitTableComponent;