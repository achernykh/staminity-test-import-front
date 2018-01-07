export const userSettingsProfileFilter = () => (user) => {
	return [
		user.personal.country, 
		user.personal.city, 
		user.personal.extEmail
	].filter((x) => x).join(', ');
};