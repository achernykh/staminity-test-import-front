import { copy } from 'angular';
import { IUserProfile } from "@api/user";

export class UserSettingsZonesDatamodel {

	userId: number;
    revision: number;
    trainingZones: any;

	constructor (private profile: IUserProfile) {
	    this.userId = this.profile.userId;
	    this.revision = this.profile.revision;
		this.trainingZones = copy(profile.trainingZones);
	}

	toUserProfile () : IUserProfile {
		return {
			userId: this.userId,
    		revision: this.revision,
		    trainingZones: this.trainingZones,
		} as any;
	}
}