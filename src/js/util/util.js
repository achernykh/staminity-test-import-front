export const log = (msg) => (...args) => {
    console.log(msg, ...args)
    return args[0]
}

export const times = (n) => Array.from(new Array(n)).map((_, i) => i)


export default { log, times }