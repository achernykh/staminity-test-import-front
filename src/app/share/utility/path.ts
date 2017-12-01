type Selector = Function | string | number;

export const path = (selectors: Selector[]) => {
    let getters = selectors.map((selector: Selector) : Function => {
        switch (typeof selector) {
            case "function": return <Function>selector;
            case "string": return (x) => x ? x[<string>selector] : x;
            case "number": return (x) => x ? x[<number>selector] : x;
            default: return () => {};
        }
    });

    return (x0: any) : any => getters.reduce((x, getter) => getter(x), x0);
};