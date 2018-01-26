import { SearchResultByUser } from "@api/search/search.interface";
import { SocketService } from "../core";

export class SearchModule {
    usp: SearchFactory<SearchResultByUser, UserSearchFilter>;

    constructor () {

    }

    lala (): void {
        this.usp.init({});
        this.usp.filterData.nameSubstring = "lala";
    }
}

class SearchFactory<T, F extends CollectionFilter> implements Collection<T, F>, Iterable<T> {
    itemList: Array<T>;
    filterData: F;
    curPosition: number;
    socket: SocketService;

    init (filterData): this {
        this.curPosition = -1; //
        this.filterData = filterData;
        return this;
    }

    isEmpty (): boolean {
        return this.itemList.length > 0;
    }

    getCount (): number {
        return this.itemList.length;
    }

    push<T> (itemList: Array<T>): void {
        // FIXME нужна реализация метода, прнимающего на вход как отдельный элемент, так и список
    }

    clear (): void {
        this.itemList.forEach(e => this.remove(e));
    }

    getItem (idx: number): T {
        return this.itemList[ idx ];
    }

    getList (): Array<T> {
        return this.itemList;
    }

    remove<T> (item: T): T {
        return item;
    }

    searchBackendData (): void {
        if (this.filterData.requestType.length === 0) {
            // FIXME нужно обработать вариант, когда программист забыл явно указать тип запроса, выполняемого в бэке
        }
        // FIXME возможно тут ошибка в распознавании массива и единичного элемента
        this.socket.send(this.filterData).then((result) => {
            if (result.hasOwnProperty("arrayResult")) {
                this.itemList.push(result.arrayResult);
            } else {
                this.itemList.push(result);
            }
        });
    }

    searchNextBackendData (): void {
        // ищем элементы дальше тех, которые уже к нам загружена согласно условиям
        this.filterData.offset = this.getCount();
        // вызываем поиск еще раз
        this.searchBackendData();
    }

    getFilterParams (): any {
        return this.filterData;
    }

    setFilterParameter (parameterName: string, parameterValue: any): F {
        // FIXME необходимо реализовать динамическое присвоение значений полям, имена которых передаются в параметре метода
        return this.filterData;
    };

    hasNext (): boolean {
        return !this.isEmpty() && this.curPosition < this.getCount();
    }

    getNext (): T {
        return this.getItem(this.curPosition++);
    }
}

export interface UserSearchFilter extends CollectionFilter {
    requestType: "searchUsersAndGroups";
    nameSubstring: string;

    setNameSubstring(str: string): UserSearchFilter;
}

export interface CoachSearchFilter extends CollectionFilter {
    nameSubstring: string;
    readyForHire: boolean;
}

export interface ClubSearchFilter extends CollectionFilter {
    nameSubstring: string;
}

/**
 * Базовый интерфейс итератора
 */
interface Iterable<T> {
    /**
     * Текущая позиция итератора относительно коллекции
     */
    curPosition: number;

    /**
     * Коллекция имеет след-й элемент относительно текущего
     * @returns {boolean}
     */
    hasNext(): boolean;

    /**
     * Получение следующего элемента из коллекции
     * @returns {T}
     */
    getNext(): T;
}

/**
 * Базовый набор параметров фильтрации списков на основе страничной загрузки данных
 */
export interface CollectionFilter {
    requestType: string;
    limit: number;
    offset: number;

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
     * Коллекция не содержит элементов
     * @returns {boolean}
     */
    isEmpty(): boolean;

    /**
     * Кол-во элементов в списке
     * @returns {number}
     */
    getCount(): number;

    /**
     * Добавление в коллекцию списка элементов
     * @param {Array<T>} itemList
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
    remove<T>(item: T): T;

    /**
     * Загрузка данных в коллекцию из бэка на основе параметров
     */
    searchBackendData(): void;

    /**
     * Загрузка следующей пачки данных в коллекцию на основе того же набора параметров фильтрации
     */
    searchNextBackendData(): void;

    setFilterParameter(parameterName: string, parameterValue: any): F;

    getFilterParams(): any;
}