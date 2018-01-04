import { IUserProfile } from "@api/user";

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