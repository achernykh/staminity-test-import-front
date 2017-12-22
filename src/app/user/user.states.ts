import { StateDeclaration, Transition } from "angular-ui-router";
import { SessionService } from "../core/session/session.service";

const userSettings: any = {
    name: 'user-settings',
    url: '/user-settings?userId&article&section',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
        article: null,
        section: null
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()]
    },
    views: {
        "application": {
            component: 'stUserSettings'
        }
    }
};

export const userState: Array<StateDeclaration> = [userSettings];