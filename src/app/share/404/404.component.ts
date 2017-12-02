import {IComponentController, IComponentOptions, IPromise} from "angular";
import "./404.component.scss";

class PageNotFoundCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    public static $inject = [];

    constructor() {

    }

    public $onInit() {

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
