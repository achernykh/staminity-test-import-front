//import { _UserRoles } from '../config/app.constants.js';

export const UserMenuSettings = [
    {
        icon: "account_circle",
        name: "userMenu.profile",
        link: "profile"
    },
    {
        icon: "settings",
        name: "userMenu.settings",
        link: "settings/user"
    },
    {
        icon: "help",
        name: "userMenu.help",
        link: "http://help.trainingpeaks.com/hc/en-us"
    },
    {
        icon: "exit_to_app",
        name: "userMenu.exit",
        link: "signout"
    }
];

export const AppMenuSettings = [
    {
        icon: "today",
        name: "appMenu.calendar",
        link: "calendar",
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "forum",
        name: "appMenu.feeds",
        link: "feeds",
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "insert_chart",
        name: "appMenu.reports",
        link: "reports",
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "show_chart",
        name: "appMenu.plan",
        link: "plan",
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "show_chart",
        name: "appMenu.season",
        link: "season",
        //role: [_UserRoles.user]
    },
    {
        icon: "group",
        name: "appMenu.groups",
        link: "groups",
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "developer_board",
        name: "appMenu.athletes",
        link: "athletes",
        //role: [_UserRoles.coach]
    },
    {
        icon: "security",
        name: "appMenu.admin",
        link: "admin",
        //role: [_UserRoles.admin]
    }
];

