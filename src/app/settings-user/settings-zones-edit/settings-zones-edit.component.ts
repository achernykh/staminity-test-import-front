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

    selectMethod(method: string) {
        this.settings.zones = this.calculateMethod(method, {
            FTP: this.settings['FTP'],
            minValue: this.settings['minValue'],
            maxValue: this.settings['maxValue']});
    }

    calculateMethod(method: string, measure: {FTP?: number, minValue?:number, maxValue?: number}):Array<any> {

        let zones: Array<any> = [];

        switch (method) {
            case 'Joe Frill(7)': {
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
                        valueFrom: Math.round(measure.FTP * 0.85) + 1,
                        valueTo: Math.round(measure.FTP * 0.89)
                    },
                    {
                        id: "new",
                        code: "Zone 3: Tempo",
                        valueFrom: Math.round(measure.FTP * 0.89) + 1,
                        valueTo: Math.round(measure.FTP * 0.94)
                    },
                    {
                        id: "new",
                        code: "Zone 4: SubThreshold",
                        valueFrom: Math.round(measure.FTP * 0.94) + 1,
                        valueTo: Math.round(measure.FTP * 1) - 1
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
                        valueFrom: Math.round(measure.FTP * 1.02) + 1,
                        valueTo: Math.round(measure.FTP * 1.06)
                    },
                    {
                        id: "new",
                        code: "Zone 5c: Anaerobic Capacity",
                        valueFrom: Math.round(measure.FTP * 1.06) + 1,
                        valueTo: Math.round(measure.FTP * 1.11)
                    }
                ];
                break;
            }
            case 'Karvonen(5)': { // МЕТОД: Карвонен http://www.runnertony.com/2015/08/rus.html
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
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.70) + 1,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.75)
                    },
                    {
                        id: "new",
                        code: "Zone 3",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.75) + 1,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.80)
                    },
                    {
                        id: "new",
                        code: "Zone 4",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.80) + 1,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.90)
                    },
                    {
                        id: "new",
                        code: "Zone 5",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.90) + 1,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 1.00)
                    }
                ];
                break;
            }
            case 'Yansen(6)': { // МЕТОД: Янсен http://www.runnertony.com/2015/08/rus.html
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
                        valueFrom: Math.round(measure.maxValue * 0.70)+1,
                        valueTo: Math.round(measure.maxValue * 0.80)
                    },
                    {
                        id: "new",
                        code: "A2: Аэробная (средняя интенсивность)",
                        valueFrom: Math.round(measure.maxValue * 0.80)+1,
                        valueTo: Math.round(measure.maxValue * 0.85)
                    },
                    {
                        id: "new",
                        code: "E1: Развивающая (транзитная)",
                        valueFrom: Math.round(measure.maxValue * 0.85)+1,
                        valueTo: Math.round(measure.maxValue * 0.90)
                    },
                    {
                        id: "new",
                        code: "E2: Развивающая (высокая интенсивность)",
                        valueFrom: Math.round(measure.maxValue * 0.90)+1,
                        valueTo: Math.round(measure.maxValue * 0.95)
                    },
                    {
                        id: "new",
                        code: "An: Анаэробная",
                        valueFrom: Math.round(measure.maxValue * 0.95)+1,
                        valueTo: Math.round(measure.maxValue * 1)
                    }
                ];
                break;
            }
            case 'Fitzenger-Scott(6)': { // МЕТОД: Фитзингера-Дугласа http://www.runnertony.com/2015/08/rus.html
                zones = [
                    {
                        id: "new",
                        code: "Восстановительная",
                        valueFrom: Math.round(measure.maxValue * 0.76),
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.70)
                    },
                    {
                        id: "new",
                        code: "Аэробная",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.70) + 1,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.75)
                    },
                    {
                        id: "new",
                        code: "Для длительных",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.75) + 1,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.78)
                    },
                    {
                        id: "new",
                        code: "Темп марафона",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.78) + 1,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.84)
                    },
                    {
                        id: "new",
                        code: "На повышение АнП",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.84) + 1,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.88)
                    },
                    {
                        id: "new",
                        code: "На повышение МПК",
                        valueFrom: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.88) + 1,
                        valueTo: measure.minValue + Math.round((measure.maxValue - measure.minValue) * 0.94)
                    }
                ];
                break;
            }
            case 'Andy Coggan(6)': { // http://datacranker.com/cycling-power-zones/
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
                        valueFrom: Math.round(measure.FTP * 0.55) + 1,
                        valueTo: Math.round(measure.FTP * 0.74)
                    },
                    {
                        id: "new",
                        code: "Tempo",
                        valueFrom: Math.round(measure.FTP * 0.74) + 1,
                        valueTo: Math.round(measure.FTP * 0.89)
                    },
                    {
                        id: "new",
                        code: "Lactate Threshold",
                        valueFrom: Math.round(measure.FTP * 0.89) + 1,
                        valueTo: Math.round(measure.FTP * 1.04)
                    },
                    {
                        id: "new",
                        code: "V02 Max",
                        valueFrom: Math.round(measure.FTP * 1.04) + 1,
                        valueTo: Math.round(measure.FTP * 1.20)
                    },
                    {
                        id: "new",
                        code: "Anaerobic Capacity",
                        valueFrom: Math.round(measure.FTP * 1.20) + 1,
                        valueTo: Math.round(measure.FTP * 1.40)
                    },
                    {
                        id: "new",
                        code: "Neuromuscular Power",
                        valueFrom: Math.round(measure.FTP * 1.40) + 1,
                        valueTo: Math.round(measure.FTP * 1.40)*10
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