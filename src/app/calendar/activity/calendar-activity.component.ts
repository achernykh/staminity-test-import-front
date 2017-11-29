import { IUserProfile } from "@api/user";
import { IComponentController, IComponentOptions, IFormController,IPromise, IScope, merge} from "angular";
import moment from "moment/src/moment.js";
import {Activity} from "../../activity/activity.datamodel";
import ActivityService from "../../activity/activity.service";
import {IMessageService} from "../../core/message.service";
import {CalendarCtrl} from "../calendar.component";
import {CalendarService} from "../calendar.service";
import "./calendar-activity.component.scss";

class CalendarActivityCtrl {

    owner: IUserProfile;
    currentUser: IUserProfile;
    item: any;
    selected: boolean;
    accent: boolean;

    data: Activity;
    isCreator: boolean = false;
    structured: boolean;
    segmentList: any[] = [];
    segmentListSize: number = null;
    segmentChart: any[] = [];
    collapse: {show:boolean} = {show: true};
    bottomPanelData: any = null;

    static $inject = ["$scope","$mdDialog","ActivityService", "message", "CalendarService","dialogs"];

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private ActivityService: ActivityService,
        private message: IMessageService,
        private CalendarService: CalendarService,
        private dialogs: any){

    }

    $onInit() {
        this.data = new Activity(this.item);
        //this.data.prepare();
        this.isCreator = this.data.userProfileCreator.userId === this.currentUser.userId;
        //console.log('calendar-activity=',this.data.revision, this.item.revision, this.data, this.item);
        if (this.data.bottomPanel === "data") {
            this.bottomPanelData = this.data.summaryAvg;
        }

        this.segmentChart = this.data.formChart();
        this.segmentList = this.data.prepareSegmentList();
        //console.log('CalendarActivityCtrl $onInit, summaryAvg=', this.data.summaryAvg)
        /**
         * Формат отображения тренировке в календаре зависит от нескольких параметров: 1) дата тренировки 2) факт
         * выполнения тренировки 3) наличие тренировочных сегментов (структурированная тренировка).
         * Для опредления формата необходимо анализировать типа сегментов interval.type:
         * [W] - итоговый сводный фактический интервал по тренировке
         * [P] - плановый сегмент
         * [L] - фактическая отсечка круга с устройства
         * [pW] - итоговый плановый сегмент по тренировке
         */

        // Структурированная тренировка имеет хотябы один сегмент с типом P
        //this.structured = this.item.activityHeader.intervals.some((seg) => {
        //    return seg.type == "P"
        //});
        // Задание в прошлом или будущем
        //this.planned = moment().diff(moment(this.item.dateStart, 'YYYY-MM-DD'), 'd') < 1;


        if (this.data.structured) {
            let comulativeDuration = 0;
            for (let interval of this.data.activityHeader.intervals) {
                // Собираем лист сегментов
                // Если интервал является плановым сегментов или группой, то формируем лист сегментов
                if (interval.type === "P" || interval.type === "G") {
                    //this.prepareSegmentList((interval.type == 'G'), interval);

                }
                // Собираем график сегментов
                if (interval.type === "P") {
                    comulativeDuration = this.prepareSegmentChart(interval, comulativeDuration);
                }
                if (interval.type === "pW") {
                    // TODO Добавить функцию вычисления номера зоны по значению показателя
                    //this.intensityMeasure = interval.intensityMeasure;
                    //this.intensityFtpMax = (interval.intensityFtpMax / 10).toFixed(0);
                }

            }

            // Если сегменты есть, то для графика необходимо привести значения к диапазону от 0...1
            /**if (this.segmentChart.length) {
                this.segmentChart.map((item) => {
                    item[0] = item[0] / comulativeDuration;
                    item[1] = item[1] / 100;
                    return item;
                });
            }**/

            /**
             * Вывод segmentList ограничен
             * Если количество сегментов более 4, то список выводится с ограниченным количеством строк,
             * а далее указывается … Отображаются только четыре сегмента, используются следующие правила отбора:
             * 1) Ключевые сегменты (не входящие в интервалы)
             * 2) Интервалы (включая не ключевые сегменты)
             * 3) В приоритете отбора интервалы с ключевыми сегментами
             * 4) В приоритете интервалы с ключевыми сегментами над просто ключевыми сегментами
             * 5) Если в интервале более двух сегментов, то для вывода берется первый ключевой сегмент и последующий не ключевой сегмент
             */
            // TODO Перенести 4 в переменную
            if (this.segmentList.length > 4) {
                this.segmentListSize = this.calculateSegmentListSize(this.segmentList);

                // Оставляем только ключевые сегменты (правило №1)
                for (let i = this.segmentList.length - 1; i >= 0 && this.segmentListSize > 4; i--) {
                    if (!this.segmentList[i].keyInterval) {
                        this.segmentList[i].show = false;
                        this.segmentListSize--;
                    }
                }

                if (this.segmentListSize > 4) {
                    // Убираем интервалы(группы), где нет ключевых сегментов
                    let hasKey = false;
                    for (let i = 0; i < this.segmentList.length && this.segmentListSize > 4; i++) {
                        if (this.segmentList[i].isGroup) {
                            for (let j = 0; j < this.segmentList[i].subItem; j++) {
                                if (this.segmentList[i].subItem[j].keyInterval) {
                                    hasKey = true;
                                }
                            }
                            if (!hasKey) {
                                this.segmentList[i].show = false;
                                this.segmentListSize--;
                            }
                        }
                    }
                }

                if (this.segmentListSize > 4) {
                    // Убираем не ключевые сегменты в интервалах с ключевыми сегментами
                    for (let i = 0; i < this.segmentList.length && this.segmentListSize > 4; i++) {
                        if (this.segmentList[i].isGroup) {
                            for (let j = this.segmentList[i].subItem - 1; j >= 0 && this.segmentListSize > 4; j--) {
                                if (!this.segmentList[i].subItem[j].keyInterval) {
                                    this.segmentList[i].subItem[j].show = false;
                                    this.segmentListSize--;
                                }
                            }
                        }
                    }
                }
                //console.log('CalendarItem: $onInit',this.segmentList, this.calculateSegmentListSize(this.segmentList));
            }
        }

         if (this.structured) {
            //this.bottomPanel = 'segmentList';
            //console.info('segmentChart', JSON.stringify(this.segmentChart));
        }
    }

    $onChanges(changes) {
        if (changes.hasOwnProperty("selected") && !changes.selected) {
            console.log("CalendarActivityCtrl: onChange, selected=", changes.selected);
        }
        if(changes.hasOwnProperty("item") && !changes.item.isFirstChange()) {
            this.$onInit();
        }
    }

    /**
     *
     * @param group - true если интервал является группой, false если интервал является сегментом
     * @param interval - описание интервала
     */
    prepareSegmentList(group, interval) {
        // В верстке будет использоваться данный признак для разного отображения
        interval.group = group;
        interval.show = true;
        // Если интервал одиночный
        if (!group) {
            // Если в интервале есть ссылка на вышестоящую группу, то добавлем сегмент в группу
            if (interval.hasOwnProperty("parentGroupCode")) {
                // Если значение не null
                if (!!interval.parentGroupCode) {
                    if (interval.repeatOrderIdx !== 0) {
                        return;
                    }
                    // Ищем запись группы
                    let code = this.segmentList.map((int) => int.code || null).indexOf(interval.parentGroupCode);
                    // Если группа найдена
                    if (code !== -1) {
                        this.segmentList[code].subItem.push(interval);
                    }
                } else {
                    // Если значение null, то одиночный интервал без группы
                    this.segmentList.push(interval);
                }
            } else{
                // если одиночный интервал, без группы
                this.segmentList.push(interval);
            }

        }
        // Если интервал является группой
        else {
            // Добавляем массив для запися членов группы
            interval.subItem = [];
            this.segmentList.push(interval);
        }
    }

    prepareSegmentChart(interval, duration) {
        /**
         * Для каждого интервала создается две точки на графике: начало и окончание.
         * Начало рассчитывается как время окончания предидущих интервалов и значение intensityByFtpFrom
         * Окончание рассчитывается как сумма предидущих интервалов +movingDurationLength и значение intensityByFtpTo
         */
        let comulativeDuration = duration + interval.movingDurationLength;
        /**this.segmentChart.push(
            [
                duration,
                interval.intensityByFtpFrom
            ],
            [
                comulativeDuration,
                interval.intensityByFtpTo
            ]);**/

        return comulativeDuration;
    }

    /**
     * Расчет количества сегментов с учетом вложенных элементов
     * @param list
     * @returns {number}
     */
    calculateSegmentListSize(list) {
        "use strict";
        let size = 0;
        for (let item of list) {

            if (item.group) {
                size += item.subItem.length;
            } else {
                size++;
            }
        }
        return size;
    }

    getBullet(first, middle, last) {
        let icon;
        if (first) {
            icon = `assets/icon/bullet_first.svg`;
        }
        if (middle) {
            icon = `assets/icon/bullet_middle.svg`;
        }
        if (last) {
            icon = `assets/icon/bullet_last.svg`;
        }
        return icon;
    }

    onOpen($event, mode) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: "$ctrl",
            template:
                `<md-dialog id="activity" aria-label="Activity">
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                data="$ctrl.data"
                                mode="$ctrl.mode"
                                user="$ctrl.user"
                                popup="true"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: this.data,
                mode: mode,
                user: this.owner,
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,

        }).then(() => {}, ()=> {});
    }

    /**
     * Копировать запись календаря
     */
    onCopy() {
        //this.calendar.onCopyItem([this.item]);
    }

    /**
     * Удалить запись
     */
    onDelete() {
        this.dialogs.confirm({ text: "dialogs.deletePlanActivity" })
        .then(() => this.CalendarService.deleteItem("F", [this.item.calendarItemId]))
        .then(() => {
            this.message.toastInfo("activityDeleted");
        }, (error) => {
            if (error) {
                this.message.toastError(error);
            }
        });
    }

    /**
     *
     * @param value
     */
    onToggleCollapse(value) {
        !!value ? this.collapse = null : this.collapse = {show: false};
    }
}


function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        console.log("cancel");
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
DialogController.$inject = ["$scope","$mdDialog"];

const CalendarActivityComponent: IComponentOptions = {
    bindings: {
        item: "<",
        owner: "<", //owner
        currentUser: "<",
        selected: "<",
        accent: "<",
        onSelect: "&",
    },
    require: {
        //calendar: '^calendar'
    },
    controller: CalendarActivityCtrl,
    template: require("./calendar-activity.component.html") as string,
};

export default CalendarActivityComponent;