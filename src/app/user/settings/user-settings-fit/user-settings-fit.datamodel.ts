import { IUserProfile } from "@api/user";

export class UserSettingsFitDatamodel {

	weight: number;
	height: number;
	level: number;
	activity: string[];

	constructor (private profile: IUserProfile) {
		this.weight = profile.private.weight;
		this.height = profile.private.height;
		this.level = profile.private.level;
		this.activity = profile.personal['activity'];
	}

	toUserProfile () : IUserProfile {
		return {
			userId: this.profile.userId,
    		revision: this.profile.revision,
		    private: {
		    	...this.profile.private,
		    	weight: this.weight,
		    	height: this.height,
		    	level: this.level,
		    },
		    personal: {
		    	...this.profile.personal,
		        activity: this.activity,		    	
		    },
		} as any;
	}
}