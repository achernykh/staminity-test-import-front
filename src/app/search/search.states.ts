import { StateDeclaration } from "angular-ui-router";
import { SessionService } from "../core";

const search: any = {
    name: 'search',
    url: '/search',
    params: {
        state: null,
        objType: null,
        name: null,
        country: null,
        city: null,
        activityTypes: null
    },
    loginRequired: false,
    authRequired: [],
    views: {
        "application": {
            component: 'stSearch'
        }
    },
    urlLocRu: 'https://staminity.com/search?state=coaches&lang=ru',
    urlLocEn: 'https://staminity.com/search?state=coaches&lang=en',
    urlLoc: 'search.urlLoc',
    breadcrumb: 'search.breadcrumb',
    subtitle: 'search.subtitle',
    imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
};

export const searchState: Array<StateDeclaration> = [search];

