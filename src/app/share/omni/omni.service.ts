import {IHttpService, IHttpPromise} from "angular";
import {SessionService} from "../../core/session/session.service";
import {OmniMessage} from "@app/share/omni/form/omni-form.component";

export class OmniService {
    static $inject = ["$mdDialog", "SessionService", "$http"];

    constructor(private $mdDialog: any, private session: SessionService, private $http: IHttpService) {

    }

    open(e: Event): Promise<any> {
        return this.$mdDialog.show({
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.post = (message) => {
                    this.post(message)
                        .then(r => {
                            debugger;
                        }, e => {
                            debugger;
                        })
                        .then(_ => $mdDialog.hide());
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
            locals: {
                message: {
                    user_full_name: `${this.session.getUser().public.firstName} ${this.session.getUser().public.lastName}`,
                    user_email: `${this.session.getUser().email || this.session.getUser().personal.extEmail}`,
                    language_id: this.session.getUser().display.language === 'ru' ? 1 : 2,
                }
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        });
    }

    post(message: OmniMessage): IHttpPromise<any> {
        let request = {
            method: 'POST',
            url: 'https://staminity.omnidesk.ru/api/cases.json',
            headers: {
                'Authorization': `Basic c3RhbWluaXR5QGdtYWlsLmNvbTpmYTQyZDk3NDAyYjM4MWEwZjBiNGY2NjNl`,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'content-type',
                'Content-Type': 'application/json'
            },
            data: {
                "user_email": message.user_email,
                "user_full_name": message.user_full_name,
                "subject": message.subject,
                "content": message.content_html,
                "language_id": 2,
                //"custom_fields": {"cf_25": "some text", "cf_30": "another field"},
                //"labels": [101, 102]
            }
        };
        return this.$http(request);
    }
}