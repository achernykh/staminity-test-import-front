import {translateSport, translateCategories} from "./activity.translate";

function configure($translateProvider:any) {
    // Текст представлений
    $translateProvider.translations('en', {sport: translateSport['en']});
    $translateProvider.translations('ru', {sport: translateSport['ru']});
    $translateProvider.translations('en', {category: translateCategories['en']});
    $translateProvider.translations('ru', {category: translateCategories['ru']});
}

configure.$inject = ['$translateProvider'];

export default configure;