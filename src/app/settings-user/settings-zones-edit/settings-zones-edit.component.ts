import './settings-zones-edit.component.scss';
import {IComponentOptions, IComponentController, IPromise, copy} from 'angular';

class SettingsZonesEditCtrl implements IComponentController {

    private zone: any;
    private sportSettings: any;
    private settings: any;

    public onSave: (response: {intensityFactor: string, sport: string, settings: any}) => IPromise<void>;
    public onCancel: () => IPromise<void>;

    public options:Object = {
        rowSelection: true,
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
    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.settings = copy(this.sportSettings);
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