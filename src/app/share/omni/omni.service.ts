import { IHttpService } from "angular";
import { SessionService } from "../../core/session/session.service";
import { RESTService, PostData } from "../../core/rest.service";
import { OmniMessageRequest, OmniMessage } from "./form/omni-form.component";
import * as _connection from "../../core/env.js";
import MessageService from "../../core/message.service";
import * as env from "../../core/env.js";
import {SocketService} from "@app/core";

export class OmniService {
    static $inject = ["$mdDialog", "SessionService", "$http", 'SocketService'];

    constructor (
        private $mdDialog: any,
        private session: SessionService,
        private $http: IHttpService,
        private socket: SocketService) {

    }

    open (e: Event): Promise<any> {
        let currentUser = this.session.getUser();
        let permissions = this.session.getPermissions();
        let buffer = this.socket.buffer;

        let message = {
            user_full_name: currentUser.userId && `${currentUser.public.firstName} ${currentUser.public.lastName}`,
            user_email: currentUser.userId && `${currentUser.email || this.session.getUser().personal.extEmail}`,
            language_id: (currentUser.userId && currentUser.display.language || window.navigator.language) === 'ru' ? 1 : 2,
            note: {
                content:
                    `<b>User Agent</b><br><p>${window.navigator.userAgent}</p>` +
                    `<b>Network</b><br><p>${JSON.stringify(window.navigator['connection'])}</p>` +
                    `<b>URL</b><br><p>${window.location.href}</p>` +
                    `<b>Version</b><br><p>${env.version} #${env.build}</p>`,
                files: [{
                    name: 'user-profile',
                    ext: 'json',
                    content: currentUser.userId && JSON.stringify(currentUser) || ''
                }, {
                    name: 'user-permissions',
                    ext: 'json',
                    content: currentUser.userId && Object.keys(permissions).length > 0 && JSON.stringify(permissions) || ''
                }, {
                    name: 'ws-buffer',
                    ext: 'json',
                    content: buffer.length > 0 && JSON.stringify(buffer) || ''
                }]
            }
        };
        return this.$mdDialog.show({
            controller: ["$scope", "$mdDialog", "message", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.post = (message) => {
                    this.post(message).then(_ => $mdDialog.hide());
                };
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="omni-form" aria-label="Omni Form">
                            <st-omni-form
                                    flex layout="column" layout-fill class="omni-form"
                                    message="$ctrl.message"
                              
                                    on-cancel="cancel()" on-post="post(message)">
                            </st-omni-form>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: e,
            locals: { message: message },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        });
    }

    post (message: OmniMessage): Promise<any> {
        return this.$http.post(`${_connection.protocol.rest}${_connection.server}/omnidesk/gate`, message);
        /**let request = {
            method: 'POST',
            url: 'https://staminity.omnidesk.ru/api/cases.json',
            headers: {
                'Content-Type': 'application/json'
            },
            formData: {

                    "case[user_email]": "user@domain.ru",
                    "case[user_full_name]": "User\u0027s full name",
                    "case[subject]": "I need help",
                    "case[content]": "I need help",
                    "case[language_id]": 2,
                    "case[custom_fields]": { "cf_25": "some text", "cf_30": "another field" },
                    "case[labels]": [101, 102]

            },
            auth: {
                'user': 'staminity@gmail.com',
                'pass': 'fa42d97402b381a0f0b4f663e'
            }
        };
         return this.$http(request);**/
    }
}