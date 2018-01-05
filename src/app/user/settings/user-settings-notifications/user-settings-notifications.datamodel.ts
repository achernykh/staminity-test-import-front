import { IUserProfile, IUserNotifications } from "@api/user";

export const groups = {
    user: {
        userActivities: ["sync", "zones"],
        userClub: ["clubCoach", "clubRequest", "clubRoleAssignment"],
        userCoach: ["coachActivities", "coachComments", "coachRequest", "incomingRequestAthlete"],
        userSocial: ["comments", "followActivities", "friendActivities", "friendRequests", "groupRequests", "groups", "messages"],
        userTariffs: ["billPayment", "billRecurring", "newBills", "tariffActions", "trial"],
        userStaminity: ["system"],
    },
    coach: {
        coachWork: ["athleteActivities", "athleteComments", "athleteConnections", "athleteRequest", "incomingRequestCoach", "zonesAthlete"],
    },
    club: {
        clubManagement: ["assignClubCoach", "clubRoleAssignment", "clubTariffs", "incomingRequestClub", "membersInOut", "membersRequest"],
    },
};

export class UserSettingsNotificationsDatamodel {

	notifications: any;

	constructor (private profile: IUserProfile) {
		this.notifications = profile.notifications;
	}

	toUserProfile () : IUserProfile {
		return {
			userId: this.profile.userId,
    		revision: this.profile.revision,
		    notifications: this.notifications,
		} as any;
	}
}