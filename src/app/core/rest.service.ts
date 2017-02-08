import {_connection} from './api.constants';
import {ISessionService} from './session.service';
import { IHttpService, IHttpPromise } from 'angular';

interface IPostDataRequest {
	method:string;
	url:string;
	headers:{
		'Authorization':string
	};
	data:{
		requestData:any;
		token?:string;
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
    data:any;

}

export class PostData implements IPostDataRequest {

	method:string;
	url:string;
	headers:{
		'Authorization':string
	};
	data:{
		//requestType:string;
		requestData:any;
		token?:string; // указывается в момент отправки запроса
	};

	constructor(type:string, data:any) {
		this.method = 'POST';
		this.url = 'http://' + _connection.server + type;
		this.headers = {
			'Authorization': 'Bearer '
		};
		this.data = {
			//requestType: type,
			requestData: data,
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
	mode:string;
	data:any;

	constructor(type:string, file:any) {
		this.method = 'POST';
		this.url = 'http://' + _connection.server + type;
		this.headers = {
			'Authorization': 'Bearer ',
			'Content-Type': undefined
		};
		this.mode = 'cors';
		this.withCredentials = true;
		this.data = new FormData();
		this.data.append('file', file);
	}
}

export interface IRESTService {
	postData(request:IPostDataRequest):IHttpPromise<{}>;
	postFile(request:IPostFileRequest):IHttpPromise<{}>;
}

export class RESTService implements IRESTService {
	//$http:any;
	//SessionService:ISessionService;

	static $inject = ['$http', 'SessionService'];

	constructor(private $http:IHttpService, private SessionService:ISessionService) {
		//this.$http = $http;
		//this.SessionService = SessionService;
	}

	postData(request:IPostDataRequest):IHttpPromise<{}> {
		request.headers['Authorization'] += this.SessionService.getToken();
		request.data.token = this.SessionService.getToken();
		console.log('REST Service => postData=', request);
		return this.$http(request)
			.then((response:any)=> {
				console.log('REST Service => postData success=', response);
				return response.data;
			}, (response) => {
				console.log('REST Service => postData error=', response);
				throw response.data.errorMessage; // Предполагаем, что сервер ответил ошибкой в формате systemMessage
			});
	}

	postFile(request:IPostFileRequest):IHttpPromise<{}> {
		request.headers['Authorization'] += this.SessionService.getToken();
		return this.$http(request)
			.then((result:any)=> {
				return result;
			}, (response) => {
				throw response.data.data[0].value; // Предполагаем, что сервер ответил ошибкой в формате systemMessage
			});
	}
}

