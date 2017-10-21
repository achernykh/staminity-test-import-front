import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionService } from "../session/session.service";
import { LoaderService } from "../../share/loader/loader.service";
import { IPostDataRequest, IPostFileRequest } from "./rest.interface";

@Injectable()
export class RestService {

    constructor(
        private http: HttpClient,
        private session: SessionService,
        private loader: LoaderService) {

    }

    postData(request: IPostDataRequest):Promise<any> {
        this.loader.show();

        let token: string = this.session.getToken();
        if (token){
            request.headers.set('Authorization', `Bearer ${token}`);
            request.data.token = token;
        } else {
            delete request.headers.delete('Authorization');
        }

        return new Promise((resolve,reject) => {
            this.http.post(request.url, request.data, { headers: request.headers }).toPromise()
                .then(
                    (response:any) => {
                        if(response.data.hasOwnProperty('errorMessage')) {
                            return reject(response.data);
                        } else {
                            return resolve(response.data);
                        }
                    },
                    (error) => {
                        if (error.hasOwnProperty('status') && error.status === -1){
                            return reject('internetConnectionLost');
                        } else if(error.hasOwnProperty('data') && error.data.hasOwnProperty('errorMessage')) {
                            return reject(error.data.errorMessage);
                        } else {
                            return reject('unknownErrorMessage');
                        }
                    })
                .then(() => this.loader.hide());
        });
    }

    putData(request: IPostDataRequest):Promise<any> {
        this.loader.show();

        let token: string = this.session.getToken();
        if (token){
            request.headers.set('Authorization', `Bearer ${token}`);
            request.data.token = token;
        } else {
            delete request.headers.delete('Authorization');
        }

        return new Promise((resolve,reject) => {
            this.http.put(request.url, request.data, { headers: request.headers }).toPromise()
                .then(
                    (response:any) => {
                        if(response.data.hasOwnProperty('errorMessage')) {
                            return reject(response.data);
                        } else {
                            return resolve(response.data);
                        }
                    },
                    (error) => {
                        if (error.hasOwnProperty('status') && error.status === -1){
                            return reject('internetConnectionLost');
                        } else if(error.hasOwnProperty('data') && error.data.hasOwnProperty('errorMessage')) {
                            return reject(error.data.errorMessage);
                        } else {
                            return reject('unknownErrorMessage');
                        }
                    })
                .then(() => this.loader.hide());
        });
    }

    postFile(request: IPostFileRequest):Promise<any> {
        this.loader.show();
        request.headers.set('Authorization', `Bearer ${this.session.getToken()}`);

        return new Promise((resolve, reject) => {
            this.http.post(request.url, request.data, {
                    headers: request.headers,
                    withCredentials: request.withCredentials}).toPromise()
                .then(
                    result => resolve(result),
                    error => reject(error.data.data[0].value)) // Предполагаем, что сервер ответил ошибкой в формате systemMessage
                .then(() => this.loader.hide());;
        });
    }

}