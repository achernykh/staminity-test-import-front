import moment from 'moment/src/moment';

class CalendarDayCtrl {
    constructor($mdDialog,ActionMessageService){
        this.$mdDialog = $mdDialog;
        this.ActionMessageService = ActionMessageService;
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
    newItem($event, data){
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
                console.log('user close dialog with =', response)
                if(response.type == 'post') {
                    this.calendar.onPostItem(response.item)
                    this.ActionMessageService.simple('Создана новая запись')
                }

            }, ()=> {
                console.log('user cancel dialog')
            })
    }
}
CalendarDayCtrl.$inject = ['$mdDialog','ActionMessageService'];

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