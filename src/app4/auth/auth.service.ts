import { Injectable } from "@angular/core";
import { SessionService } from "../core/session/session.service";
import { RestService } from "../core/rest/rest.service";
import { SocketService } from "../core/socket/socket.service";
import { IUserProfile } from "../../../api/user/user.interface";
import { PostData } from "../core/rest/rest.interface";
import {
    ResetPasswordRequest, SetPasswordRequest, InviteRequest,
    PostInviteRequest, UserCredentials
} from "../../../api/auth/auth.request";
import { toDay } from "../share/utilities/date";
import { GroupService } from "../core/group/group.service";

@Injectable()
export class AuthService {

    constructor(
        private session: SessionService,
        private rest: RestService,
        private socket: SocketService,
        private group: GroupService,

    ) { }

    /**
     * Проверка аутентификации пользователя. Если атрибут session определен, значит сессия пользователя установлена.
     * Параметр session может быть определен при получении обьекта authToken во время запроса api/signin, или
     * восстанолен при инициализации приложения из хранилища браузера. Провервка авторизации используется как для
     * отображения отдельных закрытых страниц сервиса для не зарегестрированных пользователей
     * @returns {boolean} - true - авторизован, false - не авторизован
     */
    isAuthenticated() : boolean {
        return !!this.session.getToken();
    }

    /**
     * Проверка полномочий пользователя
     * @param authorizedRoles
     * @returns {boolean}
     */
    isAuthorized(authorizedRoles: Array<any> = []) : boolean {
        let userRoles = this.session.getPermissions();
        return authorizedRoles.every(role => userRoles.hasOwnProperty(role) && toDay(new Date(userRoles[role])) >= toDay(new Date()));
    }

    isCoach(role: string = 'Calendar_Athletes') : boolean {
        return this.isAuthorized([role]);
    }

    isMyAthlete(user: IUserProfile = null) : Promise<any> {
        if (!user) {
            throw 'userNotFound';
        }

        let groupId = this.session.getUser().connections['allAthletes'].groupId;
        if (groupId) {
            return this.group.getManagementProfile(groupId, 'coach')
                .then((result) => {
                    let athletes: Array<any> = result.members;
                    if (!athletes || !athletes.some(member => member.userProfile.userId === user.userId)) {
                        throw 'forbidden_InsufficientRights';
                    } else {
                        return true;
                    }
                });
        } else {
            throw 'groupNotFound';
        }
    }

    isMyClub(uri: string) : Promise<any> {
        let userClubs = this.session.getUser().connections['ControlledClubs'];
        if (userClubs && userClubs.some(club => club.groupUri === uri)) {
            return Promise.resolve();
        } else {
            return Promise.reject('forbidden_InsufficientRights');
        }
    }

    isActivityPlan(role: Array<string> = ['ActivitiesPlan_User','ActivitiesPlan_Athletes']) : boolean {
        return this.isAuthorized([role[0]]) || this.isAuthorized([role[1]]);
    }

    isActivityPro(role: Array<string> = ['ActivitiesProView_User','ActivitiesProView_Athletes']) : boolean {
        return this.isAuthorized([role[0]]) || this.isAuthorized([role[1]]);
    }

    /**
     * Регистрация пользователя
     * @param request
     * @returns {Promise<any>}
     */
    signUp(request) : Promise<{}> {
        return this.rest.postData(new PostData('/signup', request));
    }

    /**
     * Вход пользователя
     * @param request
     * @returns {Promise<any>|Promise<TResult2|TResult1>|Promise<TResult>|*|Promise.<TResult>}
     */
    signIn(request) : Promise<void> {
        return this.rest.postData(new PostData('/signin', request))
            .then(response => {
                debugger;
                return response.hasOwnProperty('userProfile') && this.session.set(response);
            })
            .then(() => {
                debugger;
                return this.session.getToken() && this.socket.init();
            })
            .then(() => {
                return this.session.getUser();
            })
            .catch(error => {
                throw new Error(error);
            }); /*
            .then((response: any) => {
                if(response.data.hasOwnProperty('userProfile') && response.data.hasOwnProperty('token')) {
                    this.signedIn(response.data);
                    return response.data['userProfile'];
                } else {
                    throw new Error('dataError');
                }
            });*/
    }

    signedIn(sessionData: any) {
        //this.session.set(sessionData);
        //this.socket.open(sessionData['token']);
    }

    signOut() {
        this.session.set();
        this.socket.close({reason: 'signOut'});
    }

    /**
     * Подтверждение регистрации пользователя
     * @param request
     * @returns {Promise<any>}
     */
    confirm(request) : Promise<{}> {
        return this.rest.postData(new PostData('/confirm', request));
    }

    /**
     * Восстановление пароля
     * @param email
     * @returns {IPromise<TResult>}
     */
    resetPassword(email: string) : Promise<{}>{
        return this.rest.postData(new ResetPasswordRequest(email))
            .then(result => result['data']);
    }
    /**
     * Установка нового пароля текущего пользователя
     * @param password
     * @returns {Promise<any>}
     */
    setPassword(password: string, token: string) : Promise<{}> {
        return this.rest.putData(new SetPasswordRequest(token, password))
            .then((result) => result['data']); // Ожидаем system message
    }

    /**
     * Приглашение пользователей тренером/менеджером
     * @param group - группа AllAthletes | ClubMembers
     * @param users -
     * @returns {Promise<any>}
     */
    inviteUsers(group: number, users: Array<Object>) : Promise<any> {
        return this.socket.send(new InviteRequest(group,users));
    }

    putInvite(credentials: UserCredentials) : Promise<any> {
        return this.rest.postData(new PostData('/api/wsgate', new PostInviteRequest(credentials)))
            .then((response: any) => response.data);
    }


}