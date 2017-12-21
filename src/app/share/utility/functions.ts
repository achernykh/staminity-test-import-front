/**
 * Тождественная функция
 * @param x: A
 * @returns {A}
 */
export const id = (x: any) => x;

/**
 * Функция-константа
 * @param x: A
 * @returns {() => A}
 */
export const constant = (x: any) => () => x;

/**
 * Композиция списка функций
 * @param fs: Array<Function>
 * @param x0: any
 * @returns {any}
 */
export const pipe = (fs: Function[]) => (x0: any) => fs.reduce((x, f) => f(x), x0);
