import './application-frame.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class ApplicationFrameCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const ApplicationFrameComponent:IComponentOptions = {
    transclude: {
        title: '?stApplicationFrameTitle',
        toolbar: '?stApplicationFrameToolbar',
        content: 'stApplicationFrameContent'
    },
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ApplicationFrameCtrl,
    template: require('./application-frame.component.html') as string
};

export default ApplicationFrameComponent;