import { IUserProfile } from "@api/user";
import { path } from '../../../share/utility/path';

export class UserSettingsProfileDatamodel {

	firstName: string;
	lastName: string;
	uri: string;
	country: string;
	city: string;
	dateOfBirth: Date;
	sex: string;
	about: string;
	email: string;
	phone: string;

	constructor (private profile: IUserProfile) {
		this.firstName = profile.public.firstName;
		this.lastName = profile.public.lastName;
		this.uri = profile.public.uri;
		this.about = path(['personal', 'about']) (profile);
		this.country = path(['personal', 'country']) (profile);
		this.city = path(['personal', 'city']) (profile);
		this.dateOfBirth = path(['personal', 'birthday']) (profile);
		this.sex = path(['personal', 'sex']) (profile);
		this.email = path(['personal', 'extEmail']) (profile);
		this.phone = path(['personal', 'phone']) (profile);
	}

	toUserProfile () : IUserProfile {
		return {
			userId: this.profile.userId,
    		revision: this.profile.revision,
		    public: {
				...this.profile.public,
				firstName: this.firstName,
				lastName: this.lastName,
				uri: this.uri,
		    },
		    personal: {
		    	...this.profile.personal,
		    	about: this.about,
		    	country: this.country,
		    	city: this.city,
		        sex: this.sex,
		        birthday: this.dateOfBirth,
		        extEmail: this.email,
		        phone: this.phone,
		    },
		} as any;
	}
}