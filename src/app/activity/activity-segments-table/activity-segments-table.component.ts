import './activity-segments-table.component.scss';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import {ActivityIntervalP} from "../activity-datamodel/activity.interval-p";

class ActivitySegmentsTableCtrl implements IComponentController {

    public segments: Array<ActivityIntervalP>;
    public onSelect: (response: Object) => IPromise<void>;
    public selected:Array<any> = [];

    private options:Object = {
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

    static $inject = ['$scope'];

    constructor(private $scope: IScope) {

    }

    $onInit() {
        this.$scope['segments'] = this.segments;
        this.$scope['change'] = () => this.onSelect({
            initiator: 'splits',
            selection: {
                U: null,
                P: this.selected.map(i => i.pos - 1),
                L: null}
        });
    }
}

const ActivitySegmentsTableComponent:IComponentOptions = {
    bindings: {
        segments: '<',
        sport: '<',
        onSelect: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ActivitySegmentsTableCtrl,
    template: require('./activity-segments-table.component.html') as string
};

export default ActivitySegmentsTableComponent;