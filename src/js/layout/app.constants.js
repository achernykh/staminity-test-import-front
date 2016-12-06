import { _UserRoles } from '../config/app.constants.js';

export const UserMenuSettings = [
    {
        icon: "account_circle.svg",
        name: "userMenu.profile",
        link: "user"
    },
    {
        icon: "settings.svg",
        name: "userMenu.settings",
        link: "settings"
    },
    {
        icon: "help.svg",
        name: "userMenu.help",
        link: "http://help.trainingpeaks.com/hc/en-us"
    },
    {
        icon: "exit_to_app.svg",
        name: "userMenu.exit",
        link: "signout"
    }
];

export const AppMenuSettings = [
    {
        icon: "today.svg",
        name: "appMenu.calendar",
        link: "calendar",
        role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "forum.svg",
        name: "appMenu.feeds",
        link: "feeds",
        role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "insert_chart.svg",
        name: "appMenu.reports",
        link: "reports",
        role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "show_chart.svg",
        name: "appMenu.plan",
        link: "plan",
        role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "show_chart.svg",
        name: "appMenu.season",
        link: "season",
        role: [_UserRoles.user]
    },
    {
        icon: "group.svg",
        name: "appMenu.groups",
        link: "groups",
        role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "developer_board.svg",
        name: "appMenu.athletes",
        link: "athletes",
        role: [_UserRoles.coach]
    },
    {
        icon: "security.svg",
        name: "appMenu.admin",
        link: "admin",
        role: [_UserRoles.admin]
    }
];

