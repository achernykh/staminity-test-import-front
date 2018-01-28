import { IUserProfile } from "@api/user";

export class UserSettingsCoachDatamodel {

	firstName: string;
	lastName: string;
	about: string;
	country: string;
	city: string;
	price: string;
	contact: string;
	athletes: string;
	isFree: boolean;

	constructor (private profile: IUserProfile) {
		this.firstName = profile.public.firstName;
		this.lastName = profile.public.lastName;
		this.about = profile.personal['about'];
		this.country = profile.personal['country'];
		this.city = profile.personal['city'];
		this.price = profile.personal['price'];
		this.contact = profile.personal['contact'];
		this.athletes = profile.personal['athletes'];
		this.isFree = profile.personal['isFree'];
	}

	toUserProfile () : IUserProfile {
		return {
			userId: this.profile.userId,
    		revision: this.profile.revision,
		    public: {
				...this.profile.public,
				firstName: this.firstName,
				lastName: this.lastName,
		    },
		    personal: {
		    	...this.profile.personal,
		    	about: this.about,
		    	country: this.country,
		    	city: this.city,
		        price: this.price,
		        contact: this.contact,
		        athletes: this.athletes,
		        isFree: this.isFree,
		    },
		} as any;
	}
}