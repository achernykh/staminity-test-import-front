import { copy } from 'angular';
import { IUserProfile } from "@api/user";

export class UserSettingsZonesDatamodel {

	trainingZones: any;

	constructor (private profile: IUserProfile) {
		this.trainingZones = copy(profile.trainingZones);
	}

	toUserProfile () : IUserProfile {
		return {
			userId: this.profile.userId,
    		revision: this.profile.revision,
		    trainingZones: this.trainingZones,
		} as any;
	}
}