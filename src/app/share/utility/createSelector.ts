import { memorize } from './memorize';

export function createSelector (argSelectors: Array<Function>, f: Function) : any {
	const selector = memorize(f);
	return (...args) => selector(...argSelectors.map((argSelector) => argSelector(...args)));
};