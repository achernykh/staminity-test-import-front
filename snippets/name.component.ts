import './$NAME$.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {stripComments} from "tslint/lib/utils";

class $NAME$Ctrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const $NAME$Component:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: $NAME$Ctrl,
    template: require('./$NAME$.component.html') as string
};

export default $NAME$Component;


