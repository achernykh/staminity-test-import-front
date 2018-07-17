import './landing-content-block.component.scss';
import { IComponentOptions, IComponentController } from 'angular';

class LandingContentBlockCtrl implements IComponentController {

}

export const LandingContentBlockComponent: IComponentOptions = {
    bindings: {

    },
    controller: LandingContentBlockCtrl,
    template: require('./landing-content-block.component.html') as string
}