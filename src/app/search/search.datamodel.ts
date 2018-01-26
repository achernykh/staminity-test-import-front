import { SearchResultByUser } from "@api/search/search.interface";

export class SearchModule {
    usp: SearchPanel<SearchResultByUser, UserSearchFilter>;

    constructor () {
        let CoachSearchPanel: SearchPanel<CollectionItemDataInterfaceCoach, CoachSearchFilter>;
        //let ClubSearchPanel: SearchPanel<CollectionItemDataInterfaceCoach, ClubSearchFilter>;

        //UserSearchPanel.init({param1: "value1"});

        //console.log(UserSearchPanel.getList());
        console.log(CoachSearchPanel.getList());
    }

    lala(): void {
        this.usp.init({});
        this.usp.filterData.nameSubstring = "lala";
    }
}

class SearchPanel<T, F extends CollectionFilter> implements Collection<T, F> {
    itemList: Array<T>;
    filterData: F;

    init (filterData): this {
        this.filterData = filterData;
        return this;
    }

    getCount (): number {
        return null;
    }

    push<T> (itemList: Array<T>): void {
    }

    clear (): void {
        this.itemList.forEach(e => this.delete(e));
    }

    getItem (idx: number): T {
        let retVal: T;
        retVal = this.itemList[ idx ];
        return retVal;
    }

    getList (): Array<T> {
        return null;
    }

    delete<T> (item: T): T {
        return item;
    }

    getBackendData(): void {

    }

    getNextBackendData (): void {

    }

    getFilterParams (): any {
        return this.filterData;
    }

    setFilterParameter (parameterName: string, parameterValue: any): F {
        return this.filterData.params;
    };
}

export interface CollectionItemDataInterfaceCoach {

}

export interface CollectionItemDataInterfaceClub {

}


export interface UserSearchFilter extends CollectionFilter {
    nameSubstring: string;

    setNameSubstring(str: string) : ClubSearchFilter;
}

export interface CoachSearchFilter extends CollectionFilter {
    nameSubstring: string;
}

export interface ClubSearchFilter {
    nameSubstring: string;
}

/**
 * Базовый набор параметров фильтрации списков на основе страничной загрузки данных
 */
export interface CollectionFilter {
    limit: number;
    params: any;

    setFilterParameter(parameterName: string, parameterValue: any): CollectionFilter;

    getFilterParams(): any;
}

export interface Collection<T, F extends CollectionFilter> {
    /**
     * Основная коллекция элементов
     */
    itemList: Array<T>;

    /**
     * Данные по фильтрации
     */
    filterData: F;

    init<T, CF>(filter: CF): this;

    /**
     * Кол-во элементов в списке
     * @returns {number}
     */
    getCount(): number;

    /**
     * Инициализация коллекции по списку элементов
     * @param {Array<any>} itemList
     */
    push<T>(itemList: Array<T>): void;

    /**
     * Очистка коллекции
     */
    clear(): void;

    /**
     * Получение элемента коллекции по индексу
     * @param {number} idx
     * @returns {T}
     */
    getItem(idx: number): T;

    /**
     * Получение всех данных из коллекции
     * @returns {Array<T>}
     */
    getList(): Array<T>;

    /**
     * Удаление элемента из коллекции
     * @param {T} item
     * @returns {T}
     */
    delete<T>(item: T): T;

    /**
     * Загрузка данных в коллекцию из бэка на основе параметров
     */
    getBackendData(): void;

    /**
     * Загрузка следующей пачки данных в коллекцию на основе того же набора параметров фильтрации
     */
    getNextBackendData(): void;

    setFilterParameter(parameterName: string, parameterValue: any): F;

    getFilterParams(): any;
}