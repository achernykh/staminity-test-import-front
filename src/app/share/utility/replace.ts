export const replace = (text: string, replacements: Object) => {
	for (let key in replacements) {
		text = text.replace(key, replacements[key]);
	}
	return text;
};