import moment from 'moment/src/moment';
import * as angular from 'angular';

class DashboardTotalCtrl {
    constructor($mdDialog,ActionMessageService, ActivityService, $scope){
        this.$mdDialog = $mdDialog;
        this.ActionMessageService = ActionMessageService;
        this.ActivityService = ActivityService;
        this.$scope = $scope;
    }
    $onInit() {
    }


}
DashboardTotalCtrl.$inject = ['$mdDialog','ActionMessageService', 'ActivityService', '$scope'];

export let DashboardTotal = {
    bindings: {
        data: '<',
        selected: '<',
        accent: '<',
        onSelect: '&'
    },
    require: {
        dashboard: '^dashboard'
    },
    controller: DashboardTotalCtrl,
    template: require('./dashboard-total.component.html')
};

export default DashboardTotal;

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