import {IWindowService, copy} from 'angular';
import {ISessionService} from "./session.service";
import {Observable} from "rxjs/Rx";
import {IUserProfile} from "../../../api/user/user.interface";

export interface IStorageService {
    get(key:string):any;
    set(key:string, data:any):void;
}

const preset = {
    dashboard: {
        order: null,
        selected: null
    }
};

export default class StorageService implements IStorageService {
    private readonly location: string = 'localStorage';
    private userId: number = null;
    private profile$: Observable<IUserProfile>;

    static $inject = ['$window','SessionService'];

    constructor(private $window: IWindowService,
                private session: ISessionService) {

        this.profile$ = session.profile.subscribe(profile=> this.userId = angular.copy(profile).userId || null);
    }

    get(key:string, byUser:boolean = true):any {
        return JSON.parse(this.$window[this.location].getItem(byUser ? `${this.userId}#${key}`: key)) || null;
    }

    set(key:string, data:any, byUser:boolean = true):void {
        this.$window[this.location].setItem(byUser ? `${this.userId}#${key}`: key, JSON.stringify(data));
    }

}