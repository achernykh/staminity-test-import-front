import './landing-footer.component.scss';
import { IComponentOptions, IComponentController } from 'angular';

class LandingFooterCtrl implements IComponentController {

}

export const LandingFooterComponent: IComponentOptions = {
    bindings: {

    },
    controller: LandingFooterCtrl,
    template: require('./landing-footer.component.html') as string
}