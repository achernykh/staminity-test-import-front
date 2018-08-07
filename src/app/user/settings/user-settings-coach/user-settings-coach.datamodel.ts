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
    profileComplete: boolean;
	coachLanguage: string[];

	constructor (private profile: IUserProfile) {
		this.firstName = profile.public.firstName;
		this.lastName = profile.public.lastName;
		this.about = profile.personal && profile.personal.about || null;
		this.country = profile.personal && profile.personal.country || null;
		this.city = profile.personal && profile.personal.city || null;
		this.price = profile.personal && profile.personal.price || null;
		this.contact = profile.personal && profile.personal.contact || null;
		this.athletes = profile.personal && profile.personal.athletes || null;
		this.isFree = profile.personal && profile.personal.isFree;
        this.profileComplete = profile.public.profileComplete;
		this.coachLanguage = profile.personal.coachLanguage;
	}

	toUserProfile () : IUserProfile {
		return {
			userId: this.profile.userId,
    		revision: this.profile.revision,
		    public: {
				...this.profile.public,
				firstName: this.firstName,
				lastName: this.lastName,
                profileComplete: this.profileComplete,
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
				coachLanguage: this.coachLanguage,
		    },
		} as any;
	}
}