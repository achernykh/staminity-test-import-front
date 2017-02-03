export const id = _ => _
export const pipe = (...fs) => (x) => fs.reduce((x, f) => f(x), x)
export const times = (n) => Array.from(new Array(n)).map((_, i) => i)
export const range = (x0, x1, n) => times(n + 1).map((_, i) => x0 + (x1 - x0) * i / n)
export const last = (xs) => xs[xs.length - 1]
export const fold = (f, x0) => (xs) => xs.reduce(f, x0)
export const map = (f = id) => (xs) => xs.map(f)
export const filter = (f = id) => (xs) => xs.filter(f)
export const flatMap = (f) => fold((r, x, i) => r.concat(f(x, i)), []) 
export const unique = (xs) => [...new Set(xs)]

export const groupBy = (f = id) => (xs) => xs.reduce((a, x) => {  
    let key = f(x)
    a[key] = a[key] || []
    a[key].push(x)
    return a
}, {})

export const inherits = (proto) => (val) => val instanceof proto
export const typed = (type) => (val) => typeof val === type
export const isArray = inherits(Array)
export const isBoolean = typed('boolean')
export const isNumber = typed('number')
export const isString = typed('string')
export const isFunction = typed('function')
export const isObjectTyped = typed('object')

export const keys = (obj) => Object.keys(obj)
export const values = (obj) => keys(obj).map(key => obj[key])
export const entries = (obj) => keys(obj).map(key => [key, obj[key]])
export const object = (props) => props.reduce((o, [key, value]) => (o[key] = value, o), {})

export const log = (msg) => (x) => {
    console.log(msg, x)
    return x
}

export default { id, times, range, last, map, flatMap, fold, filter, unique, groupBy, pipe, isArray, isBoolean, isNumber, isFunction, isString, keys, values, entries, object, log }
