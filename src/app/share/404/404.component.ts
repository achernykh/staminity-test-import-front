import './404.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class PageNotFoundCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const PageNotFoundComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: PageNotFoundCtrl,
    template: require('./404.component.html') as string
};

export default PageNotFoundComponent;