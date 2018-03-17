import { IHttpPromise, IHttpPromiseCallbackArg } from 'angular';
import { SocketService } from "../core";
import {
    PostTrainingPlan, PutTrainingPlan, SearchTrainingPlan, DeleteTrainingPlan, GetTrainingPlan, ModifyTrainingPlanItem,
    ITrainingPlan, ITrainingPlanSearchResult, ITrainingPlanSearchRequest, ITrainingPlanAssignmentRequest,
    ModifyTrainingPlanAssignment, ITrainingPlanAssignment, GetTrainingPlanAssignment, ITrainingPlanAssignmentResponse,
    PublishTrainingPlan, GetTrainingPlanStore, GetTrainingPlanStoreItem, UnpublishTrainingPlan,
    GetTrainingPlanStoreItemAsGuest, PostTrainingPlanPurchase
} from "../../../api/trainingPlans";
import { IWSResponse, IRevisionResponse, ISystemMessage } from "@api/core";
import { ICalendarItem } from "@api/calendar";
import { Observable } from "rxjs";
import { RESTService, PostFile, PostData } from "../core/rest.service";
import AuthService from "@app/auth/auth.service";

/**
 * Сервис для работы с данными Долгосрочного плана
 * Долгосрочный план имеет карточку и запланированные записи в календаре, которые можно применить к календарю
 * пользователя сервиса
 * Долгосрочные планы могут быть использованы тренерами или тренерскими клубами как для внутренней работы по
 * развитию методологиии тренирочного процесса, так и выставлены на продажу пользователям сервиса для самостоятельной
 * подготовки к соревнованию
 */
export class TrainingPlansService {

    message: Observable<any>;

    static $inject = [ 'SocketService', 'RESTService', 'AuthService' ];

    constructor (private socket: SocketService,
                 private RESTService: RESTService,
                 private authService: AuthService) {

        this.message = this.socket.messages.filter(message => message.type === 'trainingPlanItem').share();
    }

    /**
     * Поиск долгосрочных планов
     * @param request
     * @returns {Promise<any>}
     */
    search (request: ITrainingPlanSearchRequest): Promise<ITrainingPlanSearchResult> {
        return this.socket.send(new SearchTrainingPlan(request));
    }

    /**
     * Поиск долгосрочных планов
     * @param request
     * @returns {Promise<any>}
     */
    store (request: ITrainingPlanSearchRequest): Promise<ITrainingPlanSearchResult> {
        return this.authService.isAuthenticated() ?
            this.socket.send(new GetTrainingPlanStore(request)) :
            this.RESTService.postData(new PostData('/api/wsgate', new GetTrainingPlanStore(request)))
                .then((response: IHttpPromiseCallbackArg<any>) => response.data);;
    }

    /**
     * Полная карточка долгосрочного плана
     * @param planId
     * @returns {Promise<any>}
     */
    get (planId: number): Promise<ITrainingPlan> {
        return this.socket.send(new GetTrainingPlan(planId));
    }

    /**
     * Карточка плана из магазина
     * @param planId
     * @param ws
     * @returns {Promise<any>}
     */
    getStoreItem (planId: number, ws: boolean = true): Promise<ITrainingPlan> {
        return ws ?
            this.socket.send(new GetTrainingPlanStoreItem(planId)) :
            this.RESTService.postData(new PostData('/api/wsgate', new GetTrainingPlanStoreItem(planId)))
                .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }

    /**
     * Получение плана для гостя перед покупкой
     * @param planId
     * @param email
     * @returns {IPromise<TResult>}
     */
    getStoreItemAsGuest (planId: number, email: string): Promise<ITrainingPlan> {
        return this.RESTService.postData(new PostData('/api/wsgate', new GetTrainingPlanStoreItemAsGuest(planId, email)))
            .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }

    /**ие карточки долгосрочного плана
     * Создан
     * @param plan
     * @returns {Promise<any>}
     */
    post (plan: ITrainingPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PostTrainingPlan(plan));
    }

    /**
     * Изменение карточки долгосрочного плана
     * @param plan
     * @returns {Promise<any>}
     */
    put (plan: ITrainingPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PutTrainingPlan(plan));
    }

    /**
     * Получение списка присовений плана
     * @param planId
     * @returns {Promise<any>}
     */
    getAssignment (planId: number): Promise<ITrainingPlanAssignmentResponse> {
        return this.socket.send(new GetTrainingPlanAssignment(planId));
    }

    /**
     * Управление присвоением плана
     * @param planId
     * @param request
     * @returns {Promise<any>}
     */
    modifyAssignment (planId: number, request: ITrainingPlanAssignmentRequest): Promise<IRevisionResponse> {
        return this.socket.send(new ModifyTrainingPlanAssignment(planId, request));
    }

    /**
     * Удаление долгосрочного плана
     * @param planId
     * @returns {Promise<any>}
     */
    delete (planId: number): Promise<IWSResponse> {
        return this.socket.send(new DeleteTrainingPlan(planId));
    }

    /**
     * Создание записи календаря в долгосрочном плане
     * @param planId
     * @param item
     * @param isSample
     * @returns {Promise<any>}
     */
    postItem (planId: number, item: ICalendarItem, isSample): Promise<IRevisionResponse> {
        return this.socket.send(new ModifyTrainingPlanItem('I', planId, item, isSample));
    }

    /**
     * Изменение записи календаря в долгосрочном плане
     * @param planId
     * @param item
     * @param isSample
     * @returns {Promise<any>}
     */
    putItem (planId: number, item: ICalendarItem, isSample: boolean = false): Promise<IRevisionResponse> {
        return this.socket.send(new ModifyTrainingPlanItem('U', planId, item, isSample));
    }

    /**
     * Удаление записи календаря в долгосрочном плане
     * @param planId
     * @param item
     * @param isSample
     * @returns {Promise<any>}
     */
    deleteItem (planId: number, item: ICalendarItem, isSample: boolean = false, rmParams?: any): Promise<IWSResponse> {
        return this.socket.send(new ModifyTrainingPlanItem('D', planId, item, isSample, rmParams));
    }

    /**
     * Публикация версии плана для магазина
     * @param planId
     * @param version
     * @returns {Promise<any>}
     */
    publish (planId: number, version: number): Promise<ISystemMessage> {
        return this.socket.send(new PublishTrainingPlan(planId, version));
    }

    /**
     * Приобритение бесплатного плана
     * @returns {Promise<any>}
     */
    getPlan (planId: number): Promise<ISystemMessage> {
        return this.socket.send(new PostTrainingPlanPurchase(planId));
    }

    /**
     * Изьятие публикации версии плана из магазина
     * @param planId
     * @param version
     * @returns {Promise<any>}
     */
    unpublish (planId: number): Promise<ISystemMessage> {
        return this.socket.send(new UnpublishTrainingPlan(planId));
    }

    /**
     * Аплоад аватара клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    setAvatar(planId: number, file: any): IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile(`/plan/icon/${planId}`, file));
    }

    /**
     * Аплоад фонового изоражения клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    setBackground(planId: number, file: any): IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile(`/plan/background/${planId}`, file));
    }
}