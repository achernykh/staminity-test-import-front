import { SessionService } from "@app/core";
import { ChatFormView, ChatOptions } from "./chat.interface";
import { ChatRoom } from './room/chat-room';
export class ChatDialogService {

    // private
    private defaultOptions: ChatOptions = {
        view: ChatFormView.Slim,
        hideBackButton: false
    };
    static $inject = ['$mdDialog', 'SessionService'];
    constructor(private $mdDialog, private session: SessionService) {}

    open(e: Event, options: ChatOptions = this.defaultOptions, room = null): Promise<any> {
        let dialog = {
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.close = () => $mdDialog.cancel();
                $scope.answer = (mode, plan) => $mdDialog.hide({mode, plan});
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="chat-form" aria-label="Training Plan Form">
                            <st-chat layout="column" layout-fill
                                     class="chat"
                                     options="$ctrl.options"
                                     current-room="$ctrl.room"
                                     on-close="close()">
                            </st-chat>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: e,
            locals: {
                options: options,
                room: new ChatRoom(room)
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        };
        return this.$mdDialog.show(dialog);
    }
}