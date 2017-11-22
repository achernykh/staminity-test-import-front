export const inviteDialogConf = (groupId, $event) => {
    return {
        controller: InviteDialogController,
        controllerAs: '$ctrl',
        template: require('./invite.dialog.html'),
        parent: angular.element(document.body),
        targetEvent: $event,
        locals: { groupId },
        bindToController: true,
        clickOutsideToClose: false,
        escapeToClose: true,
        fullscreen: true

    };
};
        
class InviteDialogController {

    static $inject = ['$scope','$mdDialog'];

    hide = () => {
        this.$mdDialog.hide();
    }

    cancel = () => {
        this.$mdDialog.cancel();
    }

    answer = (answer) => {
        this.$mdDialog.hide(answer);
    }

    constructor (
        private $scope: any, 
        private $mdDialog: any,
    ) {
        $scope.hide = this.hide;
        $scope.cancel = this.cancel;
        $scope.answer = this.answer;
    }
}