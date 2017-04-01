import './settings-zones-edit.component.scss';
import {IComponentOptions, IComponentController, IPromise, copy} from 'angular';
import {_CalculationMethod} from "../settings-user.constants";

class SettingsZonesEditCtrl implements IComponentController {

    private zone: any;
    private sportSettings: any;
    private settings: any;

    public onSave: (response: {intensityFactor: string, sport: string, settings: any}) => IPromise<void>;
    public onCancel: () => IPromise<void>;

    public options:Object = {
        rowSelection: false,
        multiSelect: true,
        autoSelect: false,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: false,
        pageSelect: false
    };
    public selected:Array<any> = [];
    private readonly measures: Array<string> = ['FTP','minValue', 'maxValue'];
    private readonly calculationMethod: any = _CalculationMethod;

    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.settings = copy(this.sportSettings);
    }

    selectMethod(method: string, factor: string) {
        this.settings.calculateMethod = method;
        this.settings.zones = this.calculateMethod(method, {
            FTP: this.settings['FTP'],
            minValue: this.settings['minValue'],
            maxValue: this.settings['maxValue']}, factor);
    }

    calculateMethod(method: string, measure: {FTP?: number, minValue?:number, maxValue?: number}, factor: string):Array<any> {

        let zones: Array<any> = [];
        let step: number = factor !== 'speed' ? 1 : 0.00000000000001;

        switch (method) {
            case 'JoeFrielHeartRateRunning7': {
                zones = [
                    {
                        id: "new",
                        code: "Zone 1: Recovery",
                        valueFrom: measure.minValue,
                        valueTo: Math.round(measure.FTP * 0.85)
                    },
                    {
                        id: "new",
                        code: "Zone 2: Aerobic",
                        valueFrom: Math.round(measure.FTP * 0.85) + step,
                        valueTo: Math.round(measure.FTP * 0.89)
                    },
                    {
                        id: "new",
                        code: "Zone 3: Tempo",
                        valueFrom: Math.round(measure.FTP * 0.89) + step,
                        valueTo: Math.round(measure.FTP * 0.94)
                    },
                    {
                        id: "new",
                        code: "Zone 4: SubThreshold",
                        valueFrom: Math.round(measure.FTP * 0.94) + step,
                        valueTo: Math.round(measure.FTP * 1) - step
                    },
                    {
                        id: "new",
                        code: "Zone 5a: SuperThreshold",
                        valueFrom: Math.round(measure.FTP * 1),
                        valueTo: Math.round(measure.FTP * 1.02)
                    },
                    {
                        id: "new",
                        code: "Zone 5b: Aerobic Capacity",
                        valueFrom: Math.round(measure.FTP * 1.02) + step,
                        valueTo: Math.round(measure.FTP * 1.06)
                    },
                    {
                        id: "new",
                        code: "Zone 5c: Anaerobic Capacity",
                        valueFrom: Math.round(measure.FTP * 1.06) + step,
                        valueTo: Math.round(measure.FTP * 1.11)
                    }
                ];
                break;
            }
            case 'JoeFrielHeartRateCycling7': {
                zones = [
                    {
                        id: "new",
                        code: "Zone 1: Recovery",
                        valueFrom: measure.minValue,
                        valueTo: Math.round(measure.FTP * 0.81)
                    },
                    {
                        id: "new",
                        code: "Zone 2: Aerobic",
                        valueFrom: Math.round(measure.FTP * 0.81) + step,
                        valueTo: Math.round(measure.FTP * 0.89)
                    },
                    {
                        id: "new",
                        code: "Zone 3: Tempo",
                        valueFrom: Math.round(measure.FTP * 0.89) + step,
                        valueTo: Math.round(measure.FTP * 0.93)
                    },
                    {
                        id: "new",
                        code: "Zone 4: SubThreshold",
                        valueFrom: Math.round(measure.FTP * 0.93) + step,
                        valueTo: Math.round(measure.FTP * 1) - step
                    },
                    {
                        id: "new",
                        code: "Zone 5a: SuperThreshold",
                        valueFrom: Math.round(measure.FTP * 1),
                        valueTo: Math.round(measure.FTP * 1.03)
                    },
                    {
                        id: "new",
                        code: "Zone 5b: Aerobic Capacity",
                        valueFrom: Math.round(measure.FTP * 1.03) + step,
                        valueTo: Math.round(measure.FTP * 1.06)
                    },
                    {
                        id: "new",
                        code: "Zone 5c: Anaerobic Capacity",
                        valueFrom: Math.round(measure.FTP * 1.06) + step,
                        valueTo: Math.round(measure.FTP * 1.11)
                    }
                ];
                break;
            }
            case 'Karvonen5': { // МЕТОД: Карвонен http://www.runnertony.com/2015/08/rus.html
                zones = [
                    {
                        id: "new",
                        code: "Zone 1",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.60),
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.70)
                    },
                    {
                        id: "new",
                        code: "Zone 2",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.70) + step,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.75)
                    },
                    {
                        id: "new",
                        code: "Zone 3",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.75) + step,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.80)
                    },
                    {
                        id: "new",
                        code: "Zone 4",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.80) + step,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.90)
                    },
                    {
                        id: "new",
                        code: "Zone 5",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.90) + step,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 1.00)
                    }
                ];
                break;
            }
            case 'Yansen6': { // МЕТОД: Янсен http://www.runnertony.com/2015/08/rus.html
                zones = [
                    {
                        id: "new",
                        code: "R: Восстановительная",
                        valueFrom: Math.round(measure.maxValue * 0.60),
                        valueTo: Math.round(measure.maxValue * 0.70)
                    },
                    {
                        id: "new",
                        code: "A1: Аэробная (низкая интенсивность)",
                        valueFrom: Math.round(measure.maxValue * 0.70)+step,
                        valueTo: Math.round(measure.maxValue * 0.80)
                    },
                    {
                        id: "new",
                        code: "A2: Аэробная (средняя интенсивность)",
                        valueFrom: Math.round(measure.maxValue * 0.80)+step,
                        valueTo: Math.round(measure.maxValue * 0.85)
                    },
                    {
                        id: "new",
                        code: "E1: Развивающая (транзитная)",
                        valueFrom: Math.round(measure.maxValue * 0.85)+step,
                        valueTo: Math.round(measure.maxValue * 0.90)
                    },
                    {
                        id: "new",
                        code: "E2: Развивающая (высокая интенсивность)",
                        valueFrom: Math.round(measure.maxValue * 0.90)+step,
                        valueTo: Math.round(measure.maxValue * 0.95)
                    },
                    {
                        id: "new",
                        code: "An: Анаэробная",
                        valueFrom: Math.round(measure.maxValue * 0.95)+step,
                        valueTo: Math.round(measure.maxValue * 1)
                    }
                ];
                break;
            }
            case 'AndyCoggan6': { // http://datacranker.com/cycling-power-zones/
                zones = [
                    {
                        id: "new",
                        code: "Active Recovery",
                        valueFrom: 0,
                        valueTo: Math.round(measure.FTP * 0.55)
                    },
                    {
                        id: "new",
                        code: "Endurance",
                        valueFrom: Math.round(measure.FTP * 0.55) + step,
                        valueTo: Math.round(measure.FTP * 0.74)
                    },
                    {
                        id: "new",
                        code: "Tempo",
                        valueFrom: Math.round(measure.FTP * 0.74) + step,
                        valueTo: Math.round(measure.FTP * 0.89)
                    },
                    {
                        id: "new",
                        code: "Lactate Threshold",
                        valueFrom: Math.round(measure.FTP * 0.89) + step,
                        valueTo: Math.round(measure.FTP * 1.04)
                    },
                    {
                        id: "new",
                        code: "V02 Max",
                        valueFrom: Math.round(measure.FTP * 1.04) + step,
                        valueTo: Math.round(measure.FTP * 1.20)
                    },
                    {
                        id: "new",
                        code: "Anaerobic Capacity",
                        valueFrom: Math.round(measure.FTP * 1.20) + step,
                        valueTo: Math.round(measure.FTP * 1.40)
                    },
                    {
                        id: "new",
                        code: "Neuromuscular Power",
                        valueFrom: Math.round(measure.FTP * 1.40) + step,
                        valueTo: Math.round(measure.FTP * 1.40)*10
                    }
                ];
                break;
            }
            case 'JoeFrielSpeed7':{
                zones = [
                    {
                        id: "new",
                        code: "Zone 1: Recovery",
                        valueFrom: measure.minValue || (1000+0.1)/3600, //59:59 мин/км,
                        valueTo: measure.FTP / 1.29 //1.29
                    },
                    {
                        id: "new",
                        code: "Zone 2: Aerobic",
                        valueFrom: measure.FTP / 1.29 + step,
                        valueTo: measure.FTP / 1.14 //1.14
                    },
                    {
                        id: "new",
                        code: "Zone 3: Tempo",
                        valueFrom: measure.FTP / 1.14 + step,
                        valueTo: measure.FTP / 1.06 //1.06
                    },
                    {
                        id: "new",
                        code: "Zone 4: SubThreshold",
                        valueFrom: measure.FTP / 1.06 + step,
                        valueTo: measure.FTP / 1.00 - step
                    },
                    {
                        id: "new",
                        code: "Zone 5a: SuperThreshold",
                        valueFrom: measure.FTP / 1.0,
                        valueTo: measure.FTP / 0.97 // 0.97
                    },
                    {
                        id: "new",
                        code: "Zone 5b: Aerobic Capacity",
                        valueFrom: measure.FTP / 0.97 + step,
                        valueTo: measure.FTP / 0.90 // 0.90
                    },
                    {
                        id: "new",
                        code: "Zone 5c: Anaerobic Capacity",
                        valueFrom: measure.FTP / 0.90 + step,
                        valueTo: measure.maxValue || 1000 // 0:01 мин/км
                    }
                ];
                break;
            }
        }

        return zones;
    }
}

const SettingsZonesEditComponent:IComponentOptions = {
    bindings: {
        intensityFactor: '<',
        sport: '<',
        sportSettings: '<',
        onSave: '&',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: SettingsZonesEditCtrl,
    template: require('./settings-zones-edit.component.html') as string
};

export default SettingsZonesEditComponent;