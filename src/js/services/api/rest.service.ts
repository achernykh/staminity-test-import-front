import {_connection} from './api.constants';
import {ISessionService} from '../session/session.service';

interface IPostDataRequest {
    method:string;
    url:string;
    data:{
        requestType:string;
        requestData:any;
        token:string;
    };
}

interface IPostFileRequest {
    method:string;
    url:string;
    headers:{
        'Authorization':string,
        'Content-Type':string
    };
    withCredentials:boolean;
    file:any
}

export class PostData implements IPostDataRequest {

    method:string;
    url:string;
    data:{
        requestType:string;
        requestData:any;
        token:string;
    };

    constructor(type:string, data:any, private SessionService:ISessionService) {
        this.method = 'POST';
        this.url = 'http://' + _connection.server + type;
        this.data = {
            requestType: type,
            requestData: data,
            token: SessionService.getToken()
        };
    }
}

export class PostFile implements IPostFileRequest {

    method:string;
    url:string;
    headers:{
        'Authorization':string,
        'Content-Type':string
    };
    withCredentials:boolean;
    file:any;

    constructor(type:string, file:any) {
        this.method = 'POST';
        this.url = 'http://' + _connection.server + type;
        this.headers['Authorization'] = 'Bearer ';
        this.headers['Content-type'] = 'application/octet-stream';
        this.withCredentials = true;
        this.file = file;
    }
}

export interface IRESTService {
    postData(request:IPostDataRequest):Promise<any>;
    postFile(request:IPostFileRequest):Promise<any>;
}

export class RESTService implements IRESTService {
    $http:any;
    SessionService:ISessionService;

    constructor($http:any, SessionService:ISessionService) {
        this.$http = $http;
        this.SessionService = SessionService;
    }

    postData(request:IPostDataRequest):Promise<any> {
        request.data.token = this.SessionService.getToken();
        return this.$http(request)
            .then((result:any)=> {
                return result
            });
    }

    postFile(request:IPostFileRequest):Promise<void> {
        request.headers['Authorization'] += this.SessionService.getToken();
        return this.$http(request)
            .then((result:any)=> {
                return result
            });
    }
}

