import './search.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class SearchCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const SearchComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: SearchCtrl,
    template: require('./search.component.html') as string
};

export default SearchComponent;