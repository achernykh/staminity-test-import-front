import { IUserProfile } from "@api/user";
import { path } from '../../../share/utility/path';
import moment from 'moment/min/moment-with-locales.js';

export class UserSettingsProfileDatamodel {

	firstName: string;
	lastName: string;
	uri: string;
	country: string;
	city: string;
	birthday: Date;
	sex: string;
	about: string;
	email: string;
	phone: string;
	isCoach: boolean;
	price: string;
	contact: string;
	athletes: string;
	profileComplete: boolean;

	constructor (private profile: IUserProfile) {
		this.firstName = profile.public.firstName;
		this.lastName = profile.public.lastName;
		this.uri = profile.public.uri;
		this.about = path(['personal', 'about']) (profile);
		this.country = path(['personal', 'country']) (profile);
		this.city = path(['personal', 'city']) (profile);
		this.birthday = new Date(path(['personal', 'birthday']) (profile));
		this.sex = path(['personal', 'sex']) (profile);
		this.email = path(['personal', 'extEmail']) (profile);
		this.phone = path(['personal', 'phone']) (profile);
		this.isCoach = path(['public', 'isCoach']) (profile);
		this.price = path(['personal', 'price']) (profile);
		this.contact = path(['personal', 'contact']) (profile);
		this.athletes = path(['personal', 'athletes']) (profile);
		this.profileComplete = path(['public', 'profileComplete']) (profile);
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
				isCoach: this.isCoach,
				profileComplete: this.profileComplete,
		    },
		    personal: {
		    	...this.profile.personal,
		    	about: this.about,
		    	country: this.country,
		    	city: this.city,
		        sex: this.sex,
		        birthday: moment(this.birthday).format('YYYY.MM.DD'),
		        extEmail: this.email,
		        phone: this.phone,
				price: this.price,
				contact: this.contact,
				athletes: this.athletes
		    },
		} as any;
	}
}