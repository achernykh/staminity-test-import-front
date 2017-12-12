import { StateDeclaration } from "angular-ui-router";
import { SessionService } from "../core/session/session.service";

const methodology: any = {
    name: 'methodology',
    url: '/methodology?state&scheme',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    resolve: {
        currentUser: ['SessionService', (SessionService: SessionService) => SessionService.getUser()],
    },
    views: {
        "application": {
            component: 'stMethodology'
        }
    }
};

export const methodologyState: Array<StateDeclaration> = [methodology];