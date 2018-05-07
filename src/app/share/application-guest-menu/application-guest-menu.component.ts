import "./application-guest-menu.component.scss";
import * as angular from "angular";
import { StateService } from 'angular-ui-router';
import { IComponentController, IComponentOptions, IScope} from "angular";
import { appGuestMenu } from './application-guest-menu.constant';

class ApplicationGuestMenuCtrl implements IComponentController {

    private menu = appGuestMenu;
    static $inject = ["$state", "$mdSidenav"];

    constructor (private $state: StateService, private $mdSidenav) { }

    $onInit (): void { }

    close (): void { this.$mdSidenav("appGuestMenu").toggle();}

    getParams (params: Object): Object {
        return Object.assign({}, params, {nextState: this.$state.$current.name, nextParams: JSON.parse(JSON.stringify(this.$state.params))});
    }

    go (item): void {
        let params = this.getParams(item.params);
        debugger;
        this.$state.go(item.state, params);
        this.close();
    }

}

export const ApplicationGuestMenuComponent: IComponentOptions = {
    transclude: false,
    controller: ApplicationGuestMenuCtrl,
    template: require("./application-guest-menu.component.html") as string,
};