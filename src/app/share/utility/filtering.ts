export type Predicate<T> = (t: T) => boolean;

export type Filter<P, T> = (params: P) => Predicate<T>;

export function filtersToPredicate<P, T>  (filters: Array<Filter<P, T>>, params: P) {
    return (t: T) => filters.every((filter) => filter(params)(t));
}