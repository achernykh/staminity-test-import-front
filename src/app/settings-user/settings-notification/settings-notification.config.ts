import { IUserNotifications } from "../../../../api/user/user.interface";

export interface INotificationGroupStructure {
    user: {
        userActivities: Array<string>;
        userClub: Array<string>;
        userCoach: Array<string>;
        userSocial: Array<string>;
        userStaminity: Array<string>;
        userTariffs: Array<string>;
    };
    coach: {
        coachWork: Array<string>;
    };
    club: {
        clubManagement: Array<string>;
    };
};

export interface INotificationGroup {
    user?: {
        userActivities: IUserNotifications;
        userClub: IUserNotifications;
        userCoach: IUserNotifications;
        userSocial: IUserNotifications;
        userStaminity: IUserNotifications;
        userTariffs: IUserNotifications;
    };
    coach?: {
        coachWork: IUserNotifications;
    };
    club?: {
        coachManagement: IUserNotifications;
    };
};

export const groupStructure:INotificationGroupStructure = {
    user: {
        userActivities: ['sync', 'zones'],
        userClub: ['clubCoach', 'clubRequest', 'clubRoleAssignment'],
        userCoach: ['coachActivities', 'coachComments', 'coachRequest', 'incomingRequestAthlete'],
        userSocial: ['comments','followActivities','friendActivities','friendRequests','groupRequests','groups','messages'],
        userTariffs: ['billPayment','billRecurring','newBills','tariffActions','trial'],
        userStaminity: ['system'],
    },
    coach: {
        coachWork: ['athleteActivities','athleteComments','athleteConnections','athleteRequest','incomingRequestCoach','zonesAthlete'],
    },
    club: {
        clubManagement: ['assignClubCoach','clubRoleAssignment','clubTariffs','incomingRequestClub','membersInOut','membersRequest']
    }
};