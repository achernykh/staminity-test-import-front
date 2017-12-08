export interface CalendarItemDialogConfig {
    mdDialog: any;
    activityHeader: any;
    competitionHeader: any;
}

export const calendarItemDialogConfig: any = {
    mdDialog: {
        controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
            $scope.hide = () => $mdDialog.hide();
            $scope.cancel = () => $mdDialog.cancel();
            $scope.answer = (formMode, item) => $mdDialog.hide({ formMode: formMode, item: item });
        }],
        controllerAs: '$ctrl',
        parent: angular.element(document.body),
        bindToController: true,
        clickOutsideToClose: false,
        escapeToClose: true,
        fullscreen: true
    }
};