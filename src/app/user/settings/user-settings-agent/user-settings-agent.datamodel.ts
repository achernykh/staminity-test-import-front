import { IUserProfile } from "@api/user";
import { IAgentProfile } from "@api/agent";

export class UserSettingsAgentDatamodel {

	isActive?: boolean;
	isCompleted?: boolean; 
	revision?: number;
	isIndividual: boolean;
	agrApproved: boolean;
	residentCountry: string;
	companyDetails: {
		monetaAccount: string;
		companyName: string;
		companyINN: string;
		companyKPP: string;
		сompanyFormChecked: boolean;
	};

	constructor (private profile: IAgentProfile) {
		this.isActive = profile.isActive;
		this.isCompleted = profile.isCompleted;
		this.revision = profile.revision;
		this.isIndividual = profile.isIndividual;
		this.residentCountry = profile.residentCountry;
		this.agrApproved = profile.agrApproved;
		this.companyDetails = {
			...profile.companyDetails,
		};
	}

	toAgentProfile () : IAgentProfile {
		return {
			isActive: this.isActive,
			isCompleted: this.isCompleted,
			revision: this.revision,
			isIndividual: this.isIndividual,
			residentCountry: this.residentCountry,
			agrApproved: this.agrApproved,
			companyDetails: {
				...this.companyDetails,
			},
		} as any;
	}
}

export class UserSettingsAgentOwnerDatamodel {

	firstName: string;
	lastName: string;
	email: string;
	phone: string;

	constructor (private profile: IUserProfile) {
		this.firstName = profile.public.firstName;
		this.lastName = profile.public.lastName;
		this.email = profile['email'];
		this.phone = profile.hasOwnProperty('personal') && profile.personal.phone || null;
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
				phone: this.phone,
			},
		} as any;
	}
}