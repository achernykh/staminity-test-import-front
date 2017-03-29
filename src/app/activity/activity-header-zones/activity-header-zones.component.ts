import './activity-header-zones.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {Activity} from "../activity.datamodel";

class ActivityHeaderZonesCtrl implements IComponentController {

    public zones: any;
    public sport: string;
    public onEvent: (response: Object) => IPromise<void>;
    private factor: string = 'heartRate';
    static $inject = ['$scope'];

    constructor(private $scope: any) {

    }

    $onChanges(changes) {
        if(changes['sport'] && !changes.sport.isFirstChange()){
            console.log('sport change',this.sport);
        }
    }

    changeFactor(factor: string){
        this.factor = factor;
        //this.$scope.$apply();
    }

    getZone(factor:string = this.factor, sport: string = this.sport):Array<any> {
        return (this.zones[factor].hasOwnProperty(sport) && this.zones[factor][sport].zones) || this.zones[factor]['default'].zones;
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