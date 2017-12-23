import {IComponentOptions, IComponentController, IQService, IFilterService, IPromise, INgModelController, copy} from 'angular';
import './assignment.component.scss';
import {IActivityMeasure, ICalcMeasures, IActivityIntervalPW} from "../../../../../api/activity/activity.interface";
import {isDuration, isPace, measurementUnit, measurementUnitDisplay, validators} from "../../../share/measure/measure.constants";
import {Activity} from "../../activity-datamodel/activity.datamodel";
import {ActivityHeaderCtrl} from "../../activity-header/activity-header.component";
import {
    CalendarItemActivityCtrl,
    HeaderStructuredTab
} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import moment from 'moment/src/moment.js';
import {IAuthService} from "../../../auth/auth.service";



export enum FtpState {
    On,
    Off
}

class ActivityAssignmentCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public onChange: (result: {plan: IActivityIntervalPW, actual: ICalcMeasures, form: INgModelController}) => IPromise<void>;

    private selected:Array<number> = [];
    private percentComplete: Object = {};

    static $inject = [];

    constructor() {
    }

    $onInit() {

    }

    /**
     * Проверки на уровне полей выполняется отдельно в компонентах assignment-summary-non-structured
     * В данной функции делаются комплексные проверки
     */
    checkForm (form?: INgModelController) {

        this.item.assignmentForm.$setValidity('needDuration',
            this.item.activity.movingDuration > 0 || this.item.activity.distance > 0);
    }

    /**
     * Обработка изменений в воде данных по неструктурированной тренировки
     * @param plan - плановые данные
     * @param actual - фактические данные (пользователь мог ввести факт руками)
     * @param form - статус формы ввода
     */
    changeForm( form: INgModelController, plan: IActivityIntervalPW, actual: ICalcMeasures) {

        this.item.assignmentForm.$dirty = this.item.assignmentForm.$dirty || form.$dirty;
        this.item.assignmentForm.$valid = this.item.assignmentForm.$valid || form.$valid;
        this.item.updateAssignment(plan,actual);
        this.checkForm();

    }


}

const ActivityAssignmentComponent:IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    bindings: {
        sport: '<',
        form: '<',
        editable: '<',
        ftpMode: '<',
        change: '<',
        onChange: '&'
    },
    controller: ActivityAssignmentCtrl,
    template: require('./assignment.component.html') as string
};

export default ActivityAssignmentComponent;