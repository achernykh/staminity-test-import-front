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
    }
};

export const searchState: Array<StateDeclaration> = [search];

