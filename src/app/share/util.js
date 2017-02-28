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

export const orderBy = (f) => (xs) => xs.sort((x0, x1) => f(x0) >= f(x1)? 1 : -1)

export const equals = (x0, x1) => x0 === x1
export const allEqual = (xs, p = equals) => !xs.length || xs.every((x) => p(x, xs[0]))

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

export const memorize = (f) => {
    let memo = {}
    return (arg) => arg in memo? (memo[arg] = f(arg)) : memo[arg]
}

export const log = (msg) => (x) => {
    console.log(msg, x)
    return x
}

export const timer = (f, msg = '') => (...args) => {
    let t0 = performance.now()
    let result = f(...args)
    let t1 = performance.now()
    console.log(msg, t1 - t0, 'ms')
    return result
}

export default { id, times, range, last, map, flatMap, fold, filter, unique, groupBy, orderBy, pipe, equals, allEqual, isArray, isBoolean, isNumber, isFunction, isString, keys, values, entries, object, memorize, log, timer }
