/**
 * Последний элемент
 * @param xs: Array<T>
 * @returns {T}
 */  
export const last = (xs: any[]) : any => xs[xs.length - 1];

/**
 * Фильтрация списка
 * @param p: (A) => boolean
 * @param xs: Array<A>
 * @returns {B}
 */  
export const filter = (p: (any) => boolean) => (xs: any[]) => xs.filter(p);

/**
 * В обратном порядке
 * @param xs: Array<A>
 * @returns {Array<A>}
 */  
export const reverse = (xs: any[]) => xs.reverse();

/**
 * Сортировка
 * @param f: (Array<A>) => number | string
 * @param xs: Array<A>
 * @returns {Array<any>}
 */ 
export const orderBy = (f) => (xs) => xs.sort((x0, x1) => f(x0) >= f(x1)? 1 : -1);

/**
 * Содержит ли
 * @param xs: Array<A>
 * @param x: A
 * @returns {boolean}
 */  
export const includes = (xs: any[], x: any) : boolean => xs.indexOf(x) !== -1;

/**
 * Пересечение множеств
 * @param xs: Array<A>
 * @param ys: Array<A>
 * @returns {Array<A>}
 */  
export const intersection = (xs: any[], ys: any[]) : any[] => xs.filter((x) => includes(ys, x));

/**
 * Разность множеств
 * @param xs: Array<A>
 * @param ys: Array<A>
 * @returns {Array<A>}
 */  
export const difference = (xs: any[], ys: any[]) : any[] => xs.filter((x) => !includes(ys, x));

/**
 * Равны ли все элементы массива по данному отношению равенства
 * @param xs: Array<A>
 * @param isEqual: (A, A) => boolean
 * @returns {boolean}
 */  
export const allEqual = (xs: any[], isEqual: (x: any, y: any) => boolean) : boolean => {
	return !xs.length || xs.every((x) => isEqual(x, xs[0]));
};