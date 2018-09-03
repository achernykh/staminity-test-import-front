import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IActivityType } from "@api/activity/activity.interface";
import { getSportBasic } from "../../../activity/activity.constants";
import { userSettingsEditZoneDialog } from '../user-settings-edit-zone/user-settings-edit-zone.dialog';
import { UserSettingsZonesDatamodel } from './user-settings-zones.datamodel';
import { UserSettingsService } from "../user-settings.service";
import './user-settings-zones.component.scss';
import MessageService from "@app/core/message.service";

class UserSettingsZonesCtrl {
    
    // bind
    currentUser: IUserProfile;
    set owner (profile: IUserProfile) {
        this.datamodel = new UserSettingsZonesDatamodel(profile);
    };

    // public
    datamodel: UserSettingsZonesDatamodel;
    form: any;

    private readonly colors: {} = {heartRate: 0xE91E63, speed: 0x2196F3, power: 0x9C27B0};
    private readonly sportBasic: Array<IActivityType> = getSportBasic();

    static $inject = ['UserSettingsService', 'dialogs', 'message', '$mdDialog'];

    constructor (
        private userSettingsService: UserSettingsService,
        private dialogs: any,
        private message: MessageService,
        private $mdDialog: any
    ) {

        this.userSettingsService.updates.subscribe(changes =>
            this.datamodel = new UserSettingsZonesDatamodel(Object.assign({}, this.owner, changes)));

    }

    $onInit() {
        this.prepareZones();
    }

    $onChanges (changes): void {
        /**debugger;
        if (changes.hasOwnProperty('owner') && !changes.owner.isFirstChange() && this.owner) {
            this.datamodel = new UserSettingsZonesDatamodel(this.owner);
        }**/
    }

    prepareZones(){
        Object.keys(this.datamodel.trainingZones)
            .forEach((measure) => Object.keys(this.datamodel.trainingZones[measure])
                .forEach((sport) => {
                    let sportData = this.datamodel.trainingZones[measure][sport];
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
                        width: (i === maxIndex && (max - zone.valueFrom) / length) || (i === 0 && (zone.valueTo - min) / length) || (zone.valueTo - this.datamodel.trainingZones[measure][sport].zones[i-1].valueTo) / length,
                        //width: i !== maxIndex ? (i !== 0 ? (zone.valueTo - this.zones[measure][sport].zones[i-1].valueFrom) / length : (zone.valueTo - zone.valueFrom) / length) : (max - zone.valueFrom) / length,
                        i: i,
                        length: length,
                        prev: (i !== 0 && this.datamodel.trainingZones[measure][sport].zones[i-1].valueTo) || 0,
                        color: color,
                        opacity: opacityMin + ((opacityMax - opacityMin) * (i+1)) / (maxIndex + 1)
                    }));
                }));
    }

    putZones($event, intensityFactor, sport, sportSettings){
        this.$mdDialog.show(userSettingsEditZoneDialog($event, intensityFactor, sport, sportSettings))
        .then((response) => {
            this.datamodel.trainingZones[response.intensityFactor][response.sport] = response.settings;
            this.prepareZones();
            this.submit();
        }, (error) => {
            
        });
    }

    addSport(factor: string, sport: string) {
        this.datamodel.trainingZones[factor][sport] = this.datamodel.trainingZones[factor]['default'];
        this.submit();
    }

    deleteSport(factor: string, sport: string) {
        delete this.datamodel.trainingZones[factor][sport];
        this.submit();
    }

    submit () {
        this.userSettingsService.saveZones(this.datamodel.toUserProfile())
        .then(_ => {}, e => e && this.message.toastError(e));
    }
}

export const UserSettingsZonesComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsZonesCtrl,
    template: require('./user-settings-zones.component.html') as string
} as any;
