export type Predicate<T> = (t: T) => boolean;

export type Filter<P, T> = (params: P) => Predicate<T>;

/**
 * По списку фильтров и их настройкам возвращает предикат (функцию, пригодную для передачи в [].filter)
 * @param filters: Array<Filter<P, T>>
 * @param params: P
 * @returns {Predicate<T>}
 */  
export function filtersToPredicate<P, T>  (filters: Array<Filter<P, T>>, params: P) {
    return (t: T) => filters.every((filter) => filter(params)(t));
}
