import { path } from '../../../share/utility/path';

console.log('path', path);

export const userSettingsProfileFilter = () => (user) => {
	return [
		path(['personal', 'country']) (user), 
		path(['personal', 'city']) (user), 
		'e-mail: ' + user.email
	].filter((x) => x).join(', ');
};