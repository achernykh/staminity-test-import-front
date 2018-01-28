import { IUserProfile, IUserProfileShort } from "@api/user";

export const isCoachProfileComplete = (user: IUserProfile) => {
	return (
		user.public.avatar !== 'default.jpg' &&
	    user.public.firstName && user.public.lastName &&
	    user.personal['city'] && user.personal['country'] &&
	    user.personal['about'] && user.personal['about'].length > 5 &&
	    user.personal['price'] && user.personal['price'].length > 5 &&
	    user.personal['contact'] && user.personal['contact'].length > 5 &&
	    user.privacy.some((s) => s['key'] === 'userProfile.personal' && s.setup === 10)
    );
};