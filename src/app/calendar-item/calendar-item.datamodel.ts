import {merge} from 'angular';
import moment from 'moment/src/moment.js';
import {IMeasurementHeader, ICalendarItem, IEventHeader} from "../../../api/calendar/calendar.interface";
import {IUserProfileShort} from "../../../api/user/user.interface";
import {IActivityHeader} from "../../../api/activity/activity.interface";
import { ICalendarItemDialogOptions, ICalendarItemDialogResponse } from "./calendar-item-dialog.interface";
import { FormMode } from "../application.interface";
import { IRevisionResponse } from "../../../api/core/core";

export class CalendarItemView {

	constructor(private options: ICalendarItemDialogOptions) {

	}

	get isPopup (): boolean {
		return !!this.options.popupMode;
	}

	get isTemplate (): boolean {
		return !!this.options.templateMode;
	}

	get isTrainingPlan (): boolean {
		return !!this.options.trainingPlanMode;
	}

	get isPost (): boolean {
		return this.options.formMode === FormMode.Post;
	}

	get isPut (): boolean {
		return this.options.formMode === FormMode.Put;
	}

	set isPut (value: boolean) {
		value ? this.options.formMode = FormMode.Put : this.options.formMode = FormMode.View;
	}

	get isView (): boolean {
		return this.options.formMode === FormMode.View;
	}

	set isView (value: boolean) {
		value ? this.options.formMode = FormMode.View : this.options.formMode = FormMode.Put;
	}
}

export class CalendarItem implements ICalendarItem {

	public revision: any;
	public parentId: number;
	public calendarItemId: any;
	public dateStart: string;
	public dateEnd: string;
	public calendarItemType: string;
	public measurementHeader:IMeasurementHeader;
	public activityHeader: IActivityHeader;
	public userProfileOwner: IUserProfileShort;
	public userProfileCreator: IUserProfileShort;
	public _dateStart: Date;
	public _dateEnd: Date;
	public index: number; // index for ng-repeat in calendar-day component

	view: CalendarItemView;

	constructor(item: ICalendarItem, options?: ICalendarItemDialogOptions) {
		merge(this,item); // deep copy
		this.view = new CalendarItemView(options);
	}

	// Подготовка данных для модели отображения
	prepare(method?: string) {
		//this._dateStart = new Date(moment(this.dateStart).format('YYYY-MM-DD'));
		//this._dateStart = new Date(moment(this.dateStart).format('YYYY-MM-DD'));
		this._dateStart = new Date(this.dateStart);
		this._dateEnd = new Date(this.dateEnd);
		//this._dateEnd = new Date(moment(this.dateEnd).format('YYYY-MM-DD'));
	}

	// Подготовка данных для передачи в API
	package(userProfile?: IUserProfileShort) {
		this.dateStart = moment(this._dateStart).utc().add(moment().utcOffset(),'minutes').format();
		this.dateEnd = moment(this._dateStart).utc().add(moment().utcOffset(),'minutes').format();
		this.userProfileOwner = userProfile || this.userProfileOwner;
		return this;
	}

	// Обновление данных, после сохранения
	compile(response: IRevisionResponse) {
		debugger;
		this.revision = response.value.revision;
		this.calendarItemId = response.value.id;
		this.index = Number(`${this.calendarItemId}${this.revision}`);
	}
}