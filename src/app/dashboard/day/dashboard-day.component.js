import moment from 'moment/src/moment';
import * as angular from 'angular';

class DashboardDayCtrl {
    constructor($mdDialog,ActionMessageService, ActivityService, $scope){
        this.$mdDialog = $mdDialog;
        this.ActionMessageService = ActionMessageService;
        this.ActivityService = ActivityService;
        this.$scope = $scope;
    }
    $onInit() {
        let diff = moment().diff(moment(this.data.date),'days',true);
        this.today = diff >= 0 && diff < 1;
        console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWW', this.today, diff)
    }
    onDelete(){
        "use strict";
        let items = this.data.dashboardItems;
        console.log('DashboardDay: onDelete items=', items, this.data);
        //for (let item of items) {

        this.dashboard.onDeleteItem(this.data.dashboardItems);
        //}

    }
    onPaste(){
        "use strict";
        this.dashboard.onPasteDay(this.data.date)
    }
    onCopy(){
        "use strict";
        this.dashboard.onCopyItem(this.data.dashboardItems)
    }

    onOpen($event, type, data) {

        if(type === 'measurement')
            this.$mdDialog.show({
                controller: DialogController,
                controllerAs: '$ctrl',
                template:
                    `<md-dialog id="measurement" aria-label="Measurement">
                        <dashboard-item-measurement
                                flex layout="column" class="dashboard-item-measurement"
                                data="$ctrl.data" mode="put"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </dashboard-item-measurement>
                   </md-dialog>`,
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: data
                },
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: true

            })
                .then(response => {
                    console.log('user close dialog with =', response)

                    // При изменение записи сначала удаляем старую, потом создаем новую
                    if(response.type == 'put'){
                        this.dashboard.onDeleteItem(data)
                        this.dashboard.onPostItem(response.item)
                        this.ActionMessageService.simple('Изменения сохранены')
                    }

                    if(response.type == 'delete') {
                        this.dashboard.onDeleteItem(response.item)
                        this.ActionMessageService.simple('Запись удалена')
                    }


                }, ()=> {
                    console.log('user cancel dialog, data=',data)
                })
    }

    newActivity($event, data){
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="post-activity" aria-label="Activity">
                        <dashboard-item-activity
                                layout="row" class="dashboard-item-activity"
                                date="$ctrl.date" mode="post"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </dashboard-item-activity>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                date: new Date(data.date) // дата дня в формате ГГГГ-ММ-ДД
            },
            //resolve: {
            //    details: () => this.ActivityService.getDetails(data.activityHeader.activityId)
            //        .then(response => response, error => console.error(error))
            //},
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        })
            .then(response => {
                if(response.type === 'post') {
                    console.log('save activity', response);
                    this.dashboard.onPostItem(response.item)
                    this.ActionMessageService.simple('Создана новая запись')
                }
            }, ()=> {
                console.log('user cancel dialog')
            })
    }

    newMeasurement($event, data){
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: `<dashboard-item-measurement class="dashboard-item-measurement"` +
            `data="$ctrl.data" mode="post"` +
            `on-cancel="cancel()" on-answer="answer(response)">` +
            `</dashboard-item-measurement>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: data
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true

        })
            .then(response => {
                if(response.type == 'post') {
                    this.dashboard.onPostItem(response.item)
                    this.ActionMessageService.simple('Создана новая запись')
                }

            }, ()=> {
                console.log('user cancel dialog')
            })
    }

    newWeekend($event, data) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: `<md-dialog id="events" aria-label="Events">
                        <dashboard-item-events
                                flex layout="column" class="dashboard-item-events"
                                data="$ctrl.data" mode="put"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </dashboard-item-events>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: data
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true

        })
            .then(response => {
                console.log('user close dialog with =', response)

            }, () => {
                console.log('user cancel dialog, data=', data)
            })
    }


}
DashboardDayCtrl.$inject = ['$mdDialog','ActionMessageService', 'ActivityService', '$scope'];

export let DashboardDay = {
    bindings: {
        data: '<',
        selected: '<',
        accent: '<',
        onSelect: '&'
    },
    require: {
        dashboard: '^dashboard'
    },
    controller: DashboardDayCtrl,
    template: require('./dashboard-day.component.html')
};

export default DashboardDay;

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