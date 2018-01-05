import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { ReferenceCtrl } from '../reference.component';
import { path } from '../../share/utility/path';
import { getType, activityTypes } from "../../activity/activity.constants";
import './template.component.scss';
import { getIntervalsChartData } from "../../activity/activity.function";
import { IActivityIntervalP } from "@api/activity";
import { CalendarItemDialogService } from "../../calendar-item/calendar-item-dialog.service";
import { FormMode } from "../../application.interface";
import { ICalendarItemDialogOptions } from "../../calendar-item/calendar-item-dialog.interface";
import { templateToActivity } from "../template-dialog/template.dialog";
import { IUserProfile } from "../../../../api/user/user.interface";
import { profileShort } from "../../core/user.function";


class TemplateCtrl implements IComponentController {

    private template: IActivityTemplate;
    currentUser: IUserProfile;
    private onDelete: () => any;
    private onSelect: () => any;
    private onCopy: () => any;
    private reference: ReferenceCtrl;
    private segmentChart: any;
    private dialogOptions: ICalendarItemDialogOptions;

    static $inject = ['$scope', '$filter', '$mdDialog', 'CalendarItemDialogService'];

    constructor (
        private $scope, 
        private $filter, 
        private $mdDialog, private calendarItemDialog: CalendarItemDialogService) {

    }

    $onInit (): void {
        this.segmentChart = this.isStructured ?
            getIntervalsChartData(<Array<IActivityIntervalP>>this.template.content.filter(i => i.type === 'P')) :
            null;

        this.dialogOptions = {
            currentUser: this.currentUser,
            owner: this.currentUser,
            popupMode: true,
            formMode: FormMode.Put,
            trainingPlanMode: false,
            planId: null,
            templateMode: true,
            templateOptions: {
                templateId: this.template.id,
                code: this.template.code,
                visible: this.template.visible,
                favourite: this.template.favourite,
                groupProfile: this.template.groupProfile
            }
        };
    }

    open (e: Event): void {
        this.calendarItemDialog.activity(e, this.dialogOptions, templateToActivity(this.template))
            .then(response => {debugger;});
    }

    get isStructured (): boolean {
        return this.template.content.some(i => i.type === 'P');
    }

    get activityType () {
        let { activityTypeId } = this.template.activityCategory;
        return getType(activityTypeId);
    }

    get description () {
        return path(['content', 0, 'trainerPrescription'])(this.template) || this.template.description;
    }

    get name () {
        return this.template.code;
    }
}


const TemplateComponent: IComponentOptions = {
    bindings: {
        template: '<',
        view: '<',
        currentUser: '<',
        isMobileLayout: '<',
        onDelete: '&',
        onSelect: '&',
        onCopy: '&'
    },
    controller: TemplateCtrl,
    template: require('./template.component.html') as string
};


export default TemplateComponent;