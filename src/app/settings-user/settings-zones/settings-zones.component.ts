import './settings-zones.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IActivityType} from "../../../../api/activity/activity.interface";
import {getSportBasic} from "../../activity/activity.constants";

class SettingsZonesCtrl implements IComponentController {

    public zones: any;
    private parent: any;
    public onEvent: (response: Object) => IPromise<void>;
    private readonly colors: {} = {heartRate: 0xE91E63, speed: 0x2196F3, power: 0x9C27B0};
    private readonly sportBasic: Array<IActivityType> = getSportBasic();

    static $inject = ['$mdDialog'];

    constructor(private $mdDialog: any) {

    }

    $onInit() {
        this.prepareZones();
    }

    prepareZones(){
        Object.keys(this.zones)
            .forEach(measure => Object.keys(this.zones[measure])
                .forEach(sport => {

                    let sportData = this.zones[measure][sport];
                    let opacityMin = 0.1;
                    let opacityMax = 1.0;
                    let color = this.colors[measure];
                    let maxIndex = sportData.zones.length - 1;
                    let min = (maxIndex > 0 &&
                        ((sportData.zones[0].valueTo - sportData.zones[0].valueFrom) / (sportData.zones[1].valueTo - sportData.zones[1].valueFrom) <= 2) && sportData.zones[0].valueFrom) ||
                        (maxIndex === 0 && sportData.zones[0].valueFrom) ||
                        Math.round(sportData.zones[1].valueFrom / 2);
                    let max = (maxIndex > 0 &&
                        ((sportData.zones[maxIndex].valueTo - sportData.zones[maxIndex].valueFrom) / (sportData.zones[maxIndex - 1].valueTo - sportData.zones[maxIndex - 1].valueFrom) <= 1) && sportData.zones[maxIndex].valueTo) ||
                        (maxIndex === 0 && sportData.zones[maxIndex].valueTo) ||
                        (sportData.zones[maxIndex - 1].valueTo - sportData.zones[maxIndex - 1].valueFrom) + sportData.zones[maxIndex].valueFrom;

                    let length = max - min;
                    sportData.zones = sportData.zones.map((zone,i) => Object.assign(zone, {
                        width: (i === maxIndex && (max - zone.valueFrom) / length) || (i === 0 && (zone.valueTo - min) / length) || (zone.valueTo - this.zones[measure][sport].zones[i-1].valueTo) / length,
                        //width: i !== maxIndex ? (i !== 0 ? (zone.valueTo - this.zones[measure][sport].zones[i-1].valueFrom) / length : (zone.valueTo - zone.valueFrom) / length) : (max - zone.valueFrom) / length,
                        i: i,
                        length: length,
                        prev: (i !== 0 && this.zones[measure][sport].zones[i-1].valueTo) || 0,
                        color: color,
                        opacity: opacityMin + ((opacityMax - opacityMin) * (i+1)) / (maxIndex + 1)
                    }));
                }));
    }

    putZones($event, intensityFactor, sport, sportSettings){
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="put-zones" aria-label="Put Zones">
                        <settings-zones-edit layout="column"
                                class="settings-zones-edit"
                                intensity-factor="$ctrl.intensityFactor"
                                sport="$ctrl.sport"
                                sport-settings="$ctrl.sportSettings"
                                on-cancel="cancel()" on-save="answer(response)">
                        </settings-zones-edit>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                intensityFactor: intensityFactor,
                sport: sport,
                sportSettings: sportSettings
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        }).then(response => {
            debugger;
            this.zones[response.intensityFactor][response.sport] = response.settings;
            this.parent.update({trainingZones: true});
            this.prepareZones();
        }, error => {});


    }

    postZones($event){

    }

    deleteZones(){

    }

    addSport(factor: string, sport: string) {
        this.zones[factor][sport] = this.zones[factor]['default'];
        this.parent.update({trainingZones: true});
    }

    deleteSport(factor: string, sport: string) {
        delete this.zones[factor][sport];
        this.parent.update({trainingZones: true});
    }
}

const SettingsZonesComponent:IComponentOptions = {
    bindings: {
        zones: '<',
        onEvent: '&'
    },
    require: {
        parent: '^settingsUser'
    },
    controller: SettingsZonesCtrl,
    template: require('./settings-zones.component.html') as string
};

export default SettingsZonesComponent;

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        console.log('cancel');
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
DialogController.$inject = ['$scope','$mdDialog'];