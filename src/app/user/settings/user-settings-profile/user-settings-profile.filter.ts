export const userSettingsProfileFilter = () => (user) => {
	return [
		user.personal.country, 
		user.personal.city, 
		'e-mail: ' + user.email
	].filter((x) => x).join(', ');
};