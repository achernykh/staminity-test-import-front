export const path = (getters: Array<Function | string | number>) => (x0: any) : any => getters.reduce((x, getter) => x && (
  (typeof getter === 'function' && getter(x)) ||
  (typeof getter === 'string' && x[getter]) ||
  (typeof getter === 'number' && x[getter])
), x0);
