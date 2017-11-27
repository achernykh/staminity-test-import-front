import {_translate} from './management.translate';

function configure (
    $translateProvider: any,
) {
    $translateProvider.translations('en', {"users": _translate['en']});
    $translateProvider.translations('ru', {"users": _translate['ru']});
}

configure.$inject = ['$translateProvider'];

export default configure;