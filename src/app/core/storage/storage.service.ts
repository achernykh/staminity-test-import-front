//import {LocalForage} from 'localforage/typings/localforage.d.ts';
//const localForage: LocalForage = require('localforage');
import * as localForage from "localforage";

export class StorageService {

    private readonly location: string = "localStorage";
    private storage: any;

    constructor() {
        this.storage = window[this.location];
    }

    get(key: string): any {
        return JSON.parse(this.storage.getItem(key)) || null;
    }

    getItem (key: string): Promise<any> {
        return localForage.getItem(key);
    }

    set(key: string, data: any): void {
        this.storage.setItem(key, JSON.stringify(data));
    }

    setItem (key: string, data: any): Promise<any> {
        return localForage.setItem(key, data);
    }

    remove(key: string) {
        this.storage.removeItem(key);
    }

}
