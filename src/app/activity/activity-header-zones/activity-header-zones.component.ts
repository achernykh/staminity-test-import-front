import './activity-header-zones.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {Activity} from "../activity.datamodel";
import {ICalcMeasures} from "../../../../api/activity/activity.interface";
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";

class ActivityHeaderZonesCtrl implements IComponentController {

    public zones: any;
    public sport: string;
    public hasDetails: boolean;
    public item: CalendarItemActivityCtrl;
    public calcMeasures: ICalcMeasures;
    public movingDuration: number;
    public onEvent: (response: Object) => IPromise<void>;

    private factor: string = null;
    private readonly filter = {
        heartRateTimeInZone: 'heartRate',
        speedTimeInZone: 'speed',
        powerTimeInZone: 'power'
    };
    private readonly colors: {} = {heartRate: 0xE91E63, speed: 0x2196F3, power: 0x9C27B0};
    static $inject = ['$scope'];

    constructor(private $scope: any) {

    }

    $onChanges(changes) {
        if(changes['sport'] && !changes.sport.isFirstChange()){
            console.log('sport change',this.sport);
        }
        if(changes['hasDetails'] && !changes.hasDetails.isFirstChange()){
            this.factor = this.prepareFactor();
        }
    }

    changeFactor(factor: string){
        this.factor = factor;
        //this.$scope.$apply();
    }

    getZone(factor:string = this.factor, sport: string = this.sport):Array<any> {
        if(this.hasDetails){
            return this.calcMeasures.hasOwnProperty(factor) && this.calcMeasures[factor].zones;
        } else {
            return (this.zones[this.filter[factor]].hasOwnProperty(sport) && this.zones[this.filter[factor]][sport].zones) ||
                this.zones[this.filter[factor]]['default'].zones;
        }

    }

    $onInit() {
        this.movingDuration = this.item.activity.movingDuration;
        this.calcMeasures = this.item.activity.intervalW.calcMeasures;
        this.factor = this.prepareFactor();
    }

    prepareFactor():string {
        return (!this.hasDetails && 'heartRateTimeInZone') ||
            (this.hasDetails && this.calcMeasures.hasOwnProperty('heartRateTimeInZone') && 'heartRateTimeInZone') ||
            (this.hasDetails && this.calcMeasures.hasOwnProperty('speedTimeInZone') && 'speedTimeInZone') ||
            (this.hasDetails && this.calcMeasures.hasOwnProperty('powerTimeInZone') && 'powerTimeInZone') || null;
    }
}

const ActivityHeaderZonesComponent:IComponentOptions = {
    bindings: {
        zones: '<',
        sport: '<',
        hasDetails: '<',
        onEvent: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityHeaderZonesCtrl,
    template: require('./activity-header-zones.component.html') as string
};

export default ActivityHeaderZonesComponent;