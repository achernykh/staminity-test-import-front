import * as env from '../../../app/core/env.js';
import { HttpHeaders } from "@angular/common/http";

export interface IPostDataRequest {
    method: string;
    url: string;
    headers: HttpHeaders;
    /**headers:{
        'Authorization':string
    };**/
    data:{
        requestData: any;
        token?: string;
    };
}

export interface IPostFileRequest {
    method:string;
    url:string;
    headers: HttpHeaders;
    /**headers:{
        'Authorization':string,
        'Content-Type':string
    };**/
    withCredentials:boolean;
    data:any;

}

export class PostData implements IPostDataRequest {

    method: string;
    url: string;
    headers: HttpHeaders = new HttpHeaders();
    /*headers:{
        'Authorization':string
    };*/

    data:{
        //requestType:string;
        requestData:any;
        token?:string; // указывается в момент отправки запроса
    };

    constructor(type:string, data:any) {
        this.method = 'POST';
        this.url = env.protocol.rest + env.server + type;
        this.headers.set('Authorization', 'Bearer ');
        /*this.headers = {
            'Authorization': 'Bearer '
        };*/
        this.data = data && data.hasOwnProperty('requestData') && data || {requestData: data};
    }
}

export class GetData implements IPostDataRequest {

    method:string;
    url:string;
    headers: HttpHeaders = new HttpHeaders();
    /*headers:{
        'Authorization':string
    };*/
    data:{
        //requestType:string;
        requestData:any;
        token?:string; // указывается в момент отправки запроса
    };

    constructor(type:string, data:any) {
        this.method = 'GET';
        this.url = env.protocol.rest + env.server + type;
        this.headers.set('Authorization', 'Bearer ');
        /*this.headers = {
            'Authorization': 'Bearer '
        };*/
        this.data = data && data.hasOwnProperty('requestData') && data || {requestData: data};
    }
}

export class PostFile implements IPostFileRequest {

    method:string;
    url:string;
    headers: HttpHeaders = new HttpHeaders();
    /*headers:{
        'Authorization':string,
        'Content-Type':string
    };*/
    withCredentials:boolean;
    mode:string;
    data:any;

    constructor(type:string, file:any, attr?: Object) {
        this.method = 'POST';
        this.url = env.protocol.rest + env.server + type;
        this.headers.set('Authorization', 'Bearer ');
        this.headers.set('Content-Type', undefined);
        /*this.headers = {
            'Authorization': 'Bearer ',
            'Content-Type': undefined//'multipart/form-data'//
        };*/
        this.mode = 'cors';
        this.withCredentials = true;
        this.data = new FormData();
        this.data.append('file', file);
    }
}

