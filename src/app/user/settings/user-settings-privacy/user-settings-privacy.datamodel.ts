import { IUserProfile } from "@api/user";

export class UserSettingsPrivacyDatamodel {

	groups: any[];

	constructor (private profile: IUserProfile) {
		this.groups = profile.privacy;
	}

	toUserProfile () : IUserProfile {
		return {
			userId: this.profile.userId,
    		revision: this.profile.revision,
		    privacy: this.groups,
		} as any;
	}
}