import { IHttpPromise, IHttpService } from "angular";
import LoaderService from "../share/loader/loader.service";
import * as _connection from "./env.js";
import { SessionService} from "./index";

export interface IPostDataRequest {
    method: string;
    url: string;
    headers: {
        "Authorization": string,
    };
    data: {
        requestData: any;
        token?: string;
    };
}

interface IPostFileRequest {
    method: string;
    url: string;
    headers: {
        "Authorization": string,
        "Content-Type": string,
    };
    withCredentials: boolean;
    data: any;

}

export class PostData implements IPostDataRequest {

    method: string;
    url: string;
    headers: {
        "Authorization": string,
    };
    data: {
        //requestType:string;
        requestData: any;
        token?: string; // указывается в момент отправки запроса
    };

    constructor (type: string, data: any) {
        this.method = "POST";
        this.url = _connection.protocol.rest + _connection.server + type;
        this.headers = {
            "Authorization": "Bearer ",
        };
        this.data = data && data.hasOwnProperty("requestData") && data || {requestData: data};
    }
}

export class GetData implements IPostDataRequest {

    method: string;
    url: string;
    headers: {
        "Authorization": string,
    };
    data: {
        //requestType:string;
        requestData: any;
        token?: string; // указывается в момент отправки запроса
    };

    constructor (type: string, data: any) {
        this.method = "GET";
        this.url = _connection.protocol.rest + _connection.server + type;
        this.headers = {
            "Authorization": "Bearer ",
        };
        this.data = data && data.hasOwnProperty("requestData") && data || {requestData: data};
    }
}

export class PostFile implements IPostFileRequest {

    method: string;
    url: string;
    headers: {
        "Authorization": string,
        "Content-Type": string,
    };
    withCredentials: boolean;
    mode: string;
    data: any;

    constructor (type: string, file: any, attr?: Object) {
        this.method = "POST";
        this.url = _connection.protocol.rest + _connection.server + type;
        this.headers = {
            "Authorization": "Bearer ",
            "Content-Type": undefined, //'multipart/form-data'//
        };
        this.mode = "cors";
        this.withCredentials = true;
        this.data = new FormData();
        this.data.append("file", file);
        //Object.assign(this.data, attr);
    }
}

export interface IRESTService {
    postData (request: IPostDataRequest): IHttpPromise<{}>;
    postFile (request: IPostFileRequest): IHttpPromise<{}>;
}

export class RESTService implements IRESTService {
    //$http:any;
    //SessionService:ISessionService;

    static $inject = ["$http", "SessionService", "LoaderService"];

    constructor (private $http: IHttpService, private SessionService: SessionService, private loader: LoaderService) {
        //this.$http = $http;
        //this.SessionService = SessionService;
    }

    postData (request: IPostDataRequest): IHttpPromise<{}> {
        this.loader.show();

        const token: string = this.SessionService.getToken();
        if (token) {
            request.headers.Authorization += token;
            request.data.token = token;
        } else {
            delete request.headers.Authorization;
        }

        return this.$http(request)
            .finally(() => this.loader.hide())
            .then((response: any) => {
                console.log("REST Service => postData success=", response);
                if (response.data.hasOwnProperty("errorMessage")) {
                    throw response.data;
                } else {
                    return response.data;
                }
            }, (response) => {
                if (response.hasOwnProperty("status") && response.status === -1) {
                    throw new Error("internetConnectionLost");
                } else if (response.hasOwnProperty("data") && response.data.hasOwnProperty("errorMessage")) {
                    throw response.data.errorMessage;
                } else {
                    throw new Error("unknownErrorMessage");
                }
            });
    }

    postFile (request: IPostFileRequest): IHttpPromise<{}> {
        this.loader.show();
        request.headers.Authorization += this.SessionService.getToken();
        return this.$http(request)
            .finally(() => this.loader.hide())
            .then((response: any) => {
                if (response.data.hasOwnProperty("errorMessage")) {
                    throw response.data.errorMessage;
                } else {
                    return response.data;
                }
            }, (response) => {
                throw response.data.data[0].value; // Предполагаем, что сервер ответил ошибкой в формате systemMessage
            });
    }
}
