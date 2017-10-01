import {StateProvider, StateDeclaration} from "angular-ui-router";
import {DisplayView, DefaultTemplate, supportLng} from "../core/display.constants";
import {_translateTrainingPlansSearch} from "./training-plans.translate";

function configure($stateProvider:StateProvider, $translateProvider){

    $stateProvider
        .state('training-plans-search', <StateDeclaration>{
            url: '/training-plans/search',
            loginRequired: false,
            authRequired: [],
            resolve: {
                view: () => new DisplayView('training-plans-search')

            },
            views: DefaultTemplate('training-plans-search')
        });

    supportLng.map(lng => $translateProvider.translations(lng, { trainingPlans: _translateTrainingPlansSearch[lng] }));

}
configure.$inject = ['$stateProvider', '$translateProvider'];
export default configure;