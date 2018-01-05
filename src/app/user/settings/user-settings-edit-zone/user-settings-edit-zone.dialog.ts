import { element } from 'angular';

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        console.log('cancel');
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}

DialogController.$inject = ['$scope','$mdDialog'];

export function userSettingsEditZoneDialog (
    $event,
    intensityFactor,
    sport,
    sportSettings,
) {
    return {
        controller: DialogController,
        controllerAs: '$ctrl',
        template: require('./user-settings-edit-zone.dialog.html'),
        parent: element(document.body),
        targetEvent: $event,
        locals: {
            intensityFactor: intensityFactor,
            sport: sport,
            sportSettings: sportSettings
        },
        bindToController: true,
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true
    };
};