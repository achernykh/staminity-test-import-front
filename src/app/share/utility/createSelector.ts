import { memorize } from './memorize';

/**
 * Обёртка для удобства меморизации метода класса (в духе https://github.com/reactjs/reselect)
 * @param argSelectors: Array<Function>
 * @param f: Function
 * @returns {(...any) => any}
 */  
export function createSelector (argSelectors: Array<Function>, f: Function) : any {
	const selector = memorize(f);
	return (...args) => selector(...argSelectors.map((argSelector) => argSelector(...args)));
};