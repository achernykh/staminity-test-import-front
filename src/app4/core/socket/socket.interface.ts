export enum SocketStatus {
    Connecting,
    Open,
    Closing,
    Close
}

export interface IWSResponse {
    requestId:number;
    errorMessage?: string;
    arrayResult?: any;
    data:any;
    value?: any;
}

export interface IWSRequest {
    requestId?:number;
    requestType?:string;
    requestData?:any;
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