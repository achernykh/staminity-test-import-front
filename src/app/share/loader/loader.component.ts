import { IComponentController, IComponentOptions, IScope } from "angular";
import "./loader.component.scss";
import LoaderService from "./loader.service";

class LoaderController implements IComponentController {

    static $inject = ["LoaderService", "$scope"];

    private isVisible: boolean;

    constructor(private loaderService: LoaderService, private $scope: IScope) {
        this.loaderService.showRequested$.subscribe(() => this.show());
        this.loaderService.hideRequested$.subscribe(() => this.hide());
    }

    $onInit(): void {

    }

    private show() {
        this.isVisible = true;
        this.update();
    }

    private hide() {
        this.isVisible = false;
        this.update();
    }

    private update() {
        this.$scope.$evalAsync();
    }

}

const LoaderComponent: IComponentOptions = {
    controller: LoaderController,
    template: require("./loader.component.html") as string,
};

export default LoaderComponent;
