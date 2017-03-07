import './activity-header-zones.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {Activity} from "../activity.datamodel";

class ActivityHeaderZonesCtrl implements IComponentController {

    public zones: any;
    public sport: string;
    public onEvent: (response: Object) => IPromise<void>;
    private currentParam: string = 'heartRate';
    static $inject = [];

    constructor() {

    }

    $onChanges(changes) {
        if(changes['sport'] && !changes.sport.isFirstChange()){
            console.log('sport change',this.sport);
        }
    }

    $onInit() {

    }
}

const ActivityHeaderZonesComponent:IComponentOptions = {
    bindings: {
        zones: '<',
        sport: '<',
        onEvent: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityHeaderZonesCtrl,
    template: require('./activity-header-zones.component.html') as string
};

export default ActivityHeaderZonesComponent;