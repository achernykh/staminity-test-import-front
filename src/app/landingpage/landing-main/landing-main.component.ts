import './landing-main.component.scss';
import { IComponentOptions, IComponentController } from 'angular';

class LandingMainCtrl implements IComponentController {

}

export const LandingMainComponent: IComponentOptions = {
    bindings: {

    },
    controller: LandingMainCtrl,
    template: require('./landing-main.component.html') as string
}