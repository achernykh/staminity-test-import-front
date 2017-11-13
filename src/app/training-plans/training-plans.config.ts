import {StateProvider, StateDeclaration} from "angular-ui-router";
import {DisplayView, DefaultTemplate, supportLng} from "../core/display.constants";
import {_translateTrainingPlans} from "./training-plans.translate";

function configure($stateProvider:StateProvider, $translateProvider){

    /**$stateProvider
        .state('training-plans-search', <StateDeclaration>{
            url: '/training-plans/search',
            loginRequired: false,
            authRequired: [],
            resolve: {
                view: () => new DisplayView('trainingPlansSearch')
            },
            views: {
                "application": {
                    component: 'trainingPlansSearch'
                }
            }
        });**/

    supportLng.map(lng => $translateProvider.translations(lng, { trainingPlans: _translateTrainingPlans[lng] }));

}
configure.$inject = ['$stateProvider', '$translateProvider'];
export default configure;