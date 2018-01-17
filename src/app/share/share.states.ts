import { StateDeclaration } from "@uirouter/angularjs";
import { SessionService } from "../core/session/session.service";

const notFound: any = {
    name: "404",
    url: "/404",
    views: {
        "application": {
            component: "pageNotFound",
        },
    },
};

const profileTemplate: any = {
    name: "profileTemplate",
    url: "/application-template/profile",
    resolve: {
        user: ["SessionService", (SessionService: SessionService) => SessionService.getUser()],
    },
    views: {
        "application": {
            component: "stApplicationProfileTemplate",
        },
    },
};

export const shareStates: StateDeclaration[] = [notFound, profileTemplate];
