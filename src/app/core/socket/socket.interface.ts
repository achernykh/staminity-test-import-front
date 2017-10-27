export interface IWSResponse {
    requestId:number;
    errorMessage?: string;
    data:any;
}

export interface IWSRequest {
    requestId?:number;
    requestType?:string;
    requestData?:any;
}

export interface ISocketAsyncMessage {
    type: string;
    action: string;
    value: Object;
}

export class Deferred<T> {

    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject:  (reason?: any) => void;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject  = reject;
        });
    }
}