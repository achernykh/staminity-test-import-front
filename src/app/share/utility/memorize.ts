const equals = (xs, ys) => {
	return xs.length === ys.length && xs.every((x, i) => x === ys[i]);
};

export const memorize = (f) => {
	var prevArgs = [];
	var prevResult;

	return (...args) => {
		if (!equals(prevArgs, args)) {
			prevArgs = args;
			prevResult = f(...args);
		}

		return prevResult;
	};
};