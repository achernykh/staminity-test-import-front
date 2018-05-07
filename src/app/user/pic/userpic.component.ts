import './userpic.component.scss';

export const UserInfoComponent = {
    bindings: {
        user: "<",
    },
    template: require("./userpic.component.html") as string,
};

export const UserPicComponent = {
    bindings: {
        profile: "<",
        isPremium: "<",
        unlink: "<",
    },
    transclude: true,
    controller: ["$scope", class UserpicController {
        constructor($scope) {
        }
    }],
    template: require("./userpic.component.html") as string,
};

export const AvatarPicComponent = {
    bindings: {
        type: "<",
        avatar: "<",
        sref: "<",
        isPremium: "<",
    },
    controller: ["$scope", class AvatarPicCtrl {
        constructor($scope) {
        }
    }],
    template: require("./avatar-pic.component.html") as string,
};