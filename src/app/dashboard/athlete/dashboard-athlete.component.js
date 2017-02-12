import moment from 'moment/src/moment';
import * as angular from 'angular';

class DashboardAthleteCtrl {
    constructor($mdDialog,ActionMessageService, ActivityService, $scope){
        this.$mdDialog = $mdDialog;
        this.ActionMessageService = ActionMessageService;
        this.ActivityService = ActivityService;
        this.$scope = $scope;
    }
    $onInit() {

    }




}
DashboardAthleteCtrl.$inject = ['$mdDialog','ActionMessageService', 'ActivityService', '$scope'];

export let DashboardAthlete = {
    bindings: {
        data: '<',
        selected: '<',
        accent: '<',
        onSelect: '&'
    },
    require: {
        dashboard: '^dashboard'
    },
    controller: DashboardAthleteCtrl,
    template: require('./dashboard-athlete.component.html')
};

export default DashboardAthlete;

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