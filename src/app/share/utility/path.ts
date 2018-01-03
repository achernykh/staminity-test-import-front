type Selector = Function | string | number;

export const path = (selectors: Selector[]) => {
    const getters = selectors.map((selector: Selector): Function => {
        switch (typeof selector) {
            case "function": return selector as Function;
            case "string": return (x) => x ? x[selector as string] : x;
            case "number": return (x) => x ? x[selector as number] : x;
            default: return () => {};
        }
    });

    return (x0: any): any => getters.reduce((x, getter) => getter(x), x0);
};
