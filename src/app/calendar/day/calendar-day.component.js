import moment from 'moment/src/moment';
import * as angular from 'angular';

class CalendarDayCtrl {
    constructor($mdDialog,ActionMessageService, ActivityService, $scope){
        this.$mdDialog = $mdDialog;
        this.ActionMessageService = ActionMessageService;
        this.ActivityService = ActivityService;
        this.$scope = $scope;
    }
    $onInit(){
	    let diff = moment().diff(moment(this.data.date),'days',true);
        this.today = diff >= 0 && diff < 1;
    }
    onDelete(){
        "use strict";
        let items = this.data.calendarItems;
        console.log('CalendarDay: onDelete items=', items, this.data);
        //for (let item of items) {

            this.calendar.onDeleteItem(this.data.calendarItems);
        //}

    }
    onPaste(){
        "use strict";
        this.calendar.onPasteDay(this.data.date)
    }
    onCopy(){
        "use strict";
        this.calendar.onCopyItem(this.data.calendarItems)
    }

    onOpen($event, type, data) {

        if(type === 'activity') {
            //this.ActivityService.getDetails(data.activityHeader.activityId)
            //    .then(response => console.log(JSON.stringify(response)), error =>
            // console.error(JSON.stringify(error)));

            this.$mdDialog.show({
                controller: DialogController,
                controllerAs: '$ctrl',
                template:
                    `<md-dialog id="activity" aria-label="Activity">
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                data="$ctrl.data" details="$ctrl.details" mode="put"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: data
                },
                resolve: {
                    details: () => this.ActivityService.getDetails(data.activityHeader.activityId)
                                            .then(response => response, error => console.error(error))
                },
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: true

            })
                .then(response => {
                    console.log('user close dialog with =', response)

                    // При изменение записи сначала удаляем старую, потом создаем новую
                    if(response.type === 'put'){
                        this.calendar.onDeleteItem(data)
                        this.calendar.onPostItem(response.item)
                        this.ActionMessageService.simple('Изменения сохранены')
                    }

                    if(response.type === 'delete') {
                        this.calendar.onDeleteItem(response.item)
                        this.ActionMessageService.simple('Запись удалена')
                    }


                }, ()=> {
                    console.log('user cancel dialog, data=',data)
                })

        }

        if(type === 'measurement')
            this.$mdDialog.show({
                controller: DialogController,
                controllerAs: '$ctrl',
                template:
                    `<md-dialog id="measurement" aria-label="Measurement">
                        <calendar-item-measurement
                                flex layout="column" class="calendar-item-measurement"
                                data="$ctrl.data" mode="put"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-measurement>
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
                        this.calendar.onDeleteItem(data)
                        this.calendar.onPostItem(response.item)
                        this.ActionMessageService.simple('Изменения сохранены')
                    }

                    if(response.type == 'delete') {
                        this.calendar.onDeleteItem(response.item)
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
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                date="$ctrl.date" mode="post"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
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
                    this.calendar.onPostItem(response.item)
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
            template: `<calendar-item-measurement class="calendar-item-measurement"` +
                                                 `data="$ctrl.data" mode="post"` +
                                                 `on-cancel="cancel()" on-answer="answer(response)">` +
                      `</calendar-item-measurement>`,
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
                    this.calendar.onPostItem(response.item)
                    this.ActionMessageService.simple('Создана новая запись')
                }

            }, ()=> {
                console.log('user cancel dialog')
            })
    }
}
CalendarDayCtrl.$inject = ['$mdDialog','ActionMessageService', 'ActivityService', '$scope'];

export let CalendarDay = {
    bindings: {
        data: '<',
        selected: '<',
        accent: '<',
        onSelect: '&'
    },
    require: {
        calendar: '^calendar'
    },
    controller: CalendarDayCtrl,
    template: require('./calendar-day.component.html')
};

export default CalendarDay;

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