//import {LocalForage} from 'localforage/typings/localforage.d.ts';
//const localForage: LocalForage = require('localforage');
import * as localForage from "localforage";
import cordovaSQLiteDriver from 'localforage-cordovasqlitedriver/dist/localforage-cordovasqlitedriver.es6.js';

export class StorageService {

    private readonly location: string = "localStorage";
    private storage: any;

    constructor() {
        this.storage = window[this.location];
        localForage.ready()
            .then(_ => {
                try {
                    return localForage.defineDriver(cordovaSQLiteDriver)
                        .then(_ => localForage.setDriver([
                            cordovaSQLiteDriver._driver,
                            localForage.INDEXEDDB, localForage.WEBSQL, localForage.LOCALSTORAGE]))
                        .then(_ => console.debug('set storage driver:', localForage.driver()))// && (localForage.getItem('dbDataKey')))
                        .catch(e => console.error('set storage driver error', e));
                } catch (e) { alert(e); }
            });
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
        return localForage.setItem(key, data)
            .then(r => {
                console.debug('storage service: setItem success', r, localForage.driver());
                return r;
            }, e => console.error('storage service: setItem error', e));
    }

    remove(key: string) {
        this.storage.removeItem(key);
    }

}
