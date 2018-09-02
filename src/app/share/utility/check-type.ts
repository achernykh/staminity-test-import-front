export const inherits = (proto) => (val) => val instanceof proto;
export const typed = (type) => (val) => typeof val === type;
export const isArray = inherits(Array);
export const isUndefined = typed('undefined');
export const isBoolean = typed('boolean');
export const isNumber = typed('number');
export const isString = typed('string');
export const isFunction = typed('function');
export const isObjectTyped = typed('object');