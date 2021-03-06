import {IComponentController, IComponentOptions, IPromise} from "angular";
import "./404.component.scss";

class PageNotFoundCtrl implements IComponentController {

    data: any;
    onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const PageNotFoundComponent: IComponentOptions = {
    bindings: {
        data: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: PageNotFoundCtrl,
    template: require("./404.component.html") as string,
};

export default PageNotFoundComponent;
