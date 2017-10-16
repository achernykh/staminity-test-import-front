import * as _connection from './env.js';
import {ISessionService} from './session.service';
import { IHttpService, IHttpPromise, IPromise } from 'angular';
import { LoaderService } from "../share/loader/loader.service";

export interface IPostDataRequest {
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
		this.url = _connection.protocol.rest + _connection.server + type;
		this.headers = {
			'Authorization': 'Bearer '
		};
		this.data = data && data.hasOwnProperty('requestData') && data || {requestData: data};
	}
}

export class GetData implements IPostDataRequest {

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
		this.method = 'GET';
		this.url = _connection.protocol.rest + _connection.server + type;
		this.headers = {
			'Authorization': 'Bearer '
		};
		this.data = data && data.hasOwnProperty('requestData') && data || {requestData: data};
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

	constructor(type:string, file:any, attr?: Object) {
		this.method = 'POST';
		this.url = _connection.protocol.rest + _connection.server + type;
		this.headers = {
			'Authorization': 'Bearer ',
			'Content-Type': undefined//'multipart/form-data'//
		};
		this.mode = 'cors';
		this.withCredentials = true;
		this.data = new FormData();
		this.data.append('file', file);
		//Object.assign(this.data, attr);
	}
}

export interface IRESTService {
	postData(request:IPostDataRequest):Promise<any>;
	postFile(request:IPostFileRequest):Promise<any>;
}

export class RESTService implements IRESTService {
	//$http:any;
	//SessionService:ISessionService;

	static $inject = ['$http', 'SessionService','LoaderService'];

	constructor(private $http:IHttpService, private SessionService:ISessionService, private loader: LoaderService) {
		//this.$http = $http;
		//this.SessionService = SessionService;
	}

	postData(request:IPostDataRequest):Promise<any> {
		this.loader.show();

		let token: string = this.SessionService.getToken();
		if (token){
			request.headers['Authorization'] += token;
			request.data.token = token;
		} else {
			delete request.headers['Authorization'];
		}

		return new Promise((resolve,reject) => {
			this.$http(request)
				.then((response:any)=> {
					console.log('REST Service => postData success=', response);
					if(response.data.hasOwnProperty('errorMessage')) {
						return reject(response.data);
					} else {
						return resolve(response.data);
					}
				}, (response) => {
					if (response.hasOwnProperty('status') && response.status === -1){
						return reject('internetConnectionLost');
					} else if(response.hasOwnProperty('data') && response.data.hasOwnProperty('errorMessage')) {
						return reject(response.data.errorMessage);
					} else {
						return reject('unknownErrorMessage');
					}
				})
				.then(() => this.loader.hide());
		});
	}

	postFile(request:IPostFileRequest):Promise<any> {
		this.loader.show();
		request.headers['Authorization'] += this.SessionService.getToken();

		return new Promise((resolve, reject) => {
			this.$http(request)
				.then((result:any)=> {
					return resolve(result);
				}, (response) => {
					return reject(response.data.data[0].value); // Предполагаем, что сервер ответил ошибкой в формате systemMessage
				})
				.then(() => this.loader.hide());
		});

		/**return this.$http(request)
			.finally(()=>this.loader.hide())
			.then((result:any)=> {
				return result;
			}, (response) => {
				return response.data.data[0].value; // Предполагаем, что сервер ответил ошибкой в формате systemMessage
			});**/
	}
}

