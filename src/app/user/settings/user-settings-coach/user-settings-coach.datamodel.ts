import { IUserProfile } from "@api/user";

export class UserSettingsCoachDatamodel {

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
		this.about = profile.personal['about'];
		this.country = profile.personal['country'];
		this.city = profile.personal['city'];
		this.dateOfBirth = profile.personal.birthday;
		this.sex = profile.personal.sex;
		this.email = profile.personal.extEmail;
		this.phone = profile.personal.phone;
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