import './landing-reviews.component.scss';
import {IComponentOptions, IComponentController} from 'angular';

class LandingReviewsCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;

    // private

    // inject
    static $inject = [];

    constructor() {

    }

    $onInit(): void {

    }
}

export const LandingReviewsComponent:IComponentOptions = {
    bindings: {
        reviews: '<',
        onEvent: '&'
    },
    controller: LandingReviewsCtrl,
    template: require('./landing-reviews.component.html') as string
};