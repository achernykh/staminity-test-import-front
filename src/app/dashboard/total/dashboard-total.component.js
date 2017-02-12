import moment from 'moment/src/moment';
import * as angular from 'angular';

class DashboardTotalCtrl {
    constructor(){

        this.checked = false;
        this.total = {};
        this.totalTemplate = {
            completed: {
                distance: 0,
                movingDuration: 0
            },
            planned: {
                distance: 0,
                movingDuration: 0
            }
        }
        this.primarySport = ['run', 'bike', 'swim'];
    }
    $onInit(){
        this.weekTitle = moment(this.week.week,'YYYY-WW').week();
    }
    $onChanges(changes){

        if(changes.update){
            console.log('CalendarTotal: $onChanges => status new value', this.week.sid, this.week);
            this.total = {};
            let sport = null;
            for (let day of this.week.subItem){
                for (let item of day.data.calendarItems){
                    if (item.calendarItemType == 'activity') {
                        sport = item.activityHeader.activityType.typeBasic
                        //template = {completed: {distance: 0,movingDuration: 0},planned: {distance: 0,movingDuration: 0}}
                        if (item.activityHeader.hasOwnProperty('intervals'))
                            for (let interval of item.activityHeader.intervals) {
                                if (interval.type == 'W') {
                                    if(this.primarySport.indexOf(sport) == -1) sport = 'other'

                                    if(!this.total.hasOwnProperty(sport))
                                        Object.assign(this.total, {[sport]: {completed: {distance: 0,movingDuration: 0},planned: {distance: 0,movingDuration: 0}}})

                                    this.total[sport].completed.distance = this.total[sport].completed.distance +
                                        (interval.calcMeasures.distance.hasOwnProperty('maxValue') && interval.calcMeasures.distance.maxValue) || 0

                                    this.total[sport].completed.movingDuration = this.total[sport].completed.movingDuration +
                                        (interval.calcMeasures.movingDuration.hasOwnProperty('maxValue') && interval.calcMeasures.movingDuration.maxValue) || 0

                                    //console.log('week total temp=',sport, this.total[sport].completed.distance)
                                }
                            }
                    }

                }
            }
            console.log('week total 1', this.total);
            // Итоги по всем активностям недели
            this.summary = {completed: {distance: 0,movingDuration: 0},planned: {distance: 0,movingDuration: 0}};
            Object.keys(this.total).forEach((sport) => {
                this.summary.completed.distance += this.total[sport].completed.distance;
                this.summary.completed.movingDuration += this.total[sport].completed.movingDuration;
                this.summary.planned.distance += this.total[sport].planned.distance;
                this.summary.planned.movingDuration += this.total[sport].planned.movingDuration;

            });
            console.log('week total 2', this.total);
        }
    }

    secondToDuration(second) {
        return moment().startOf('day').seconds(second).format('H:mm:ss')
    }

}
DashboardTotalCtrl.$inject = ['$mdDialog','ActionMessageService', 'ActivityService', '$scope'];

export let DashboardTotal = {
    bindings: {
        week: '<',
        update: '<',
        selected: '<',
        accent: '<',
        onToggle: '&'
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