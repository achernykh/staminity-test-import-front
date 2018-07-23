import './landing-reviews.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import DisplayService from "@app/core/display.service";

class LandingReviewsCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;

    // private

    // inject
    static $inject = ['DisplayService'];

    constructor(private display: DisplayService) {

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