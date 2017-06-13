import {merge} from 'angular';
import moment from 'moment/src/moment.js';
import {IMeasurementHeader, ICalendarItem, IEventHeader} from "../../../api/calendar/calendar.interface";
import {IUserProfileShort} from "../../../api/user/user.interface";
import {IActivityHeader} from "../../../api/activity/activity.interface";

export class CalendarItem implements ICalendarItem {

	public revision: any;
	public calendarItemId: any;
	public dateStart: string;
	public dateEnd: string;
	public calendarItemType: string;
	public measurementHeader:IMeasurementHeader;
	public eventHeader:IEventHeader = {
		eventType: null,
		target: null
	};
	public activityHeader: IActivityHeader;
	public userProfileOwner: IUserProfileShort;
	public userProfileCreator: IUserProfileShort;
	public _dateStart: Date;
	public _dateEnd: Date;
	public index: number; // index for ng-repeat in calendar-day component

	constructor(item: ICalendarItem) {
		merge(this,item); // deep copy
	}

	// Подготовка данных для модели отображения
	prepare() {
		//this._dateStart = new Date(moment(this.dateStart).format('YYYY-MM-DD'));
		//this._dateStart = new Date(moment(this.dateStart).format('YYYY-MM-DD'));
		this._dateStart = new Date(this.dateStart);
		this._dateEnd = new Date(this.dateEnd);
		//this._dateEnd = new Date(moment(this.dateEnd).format('YYYY-MM-DD'));
	}

	// Подготовка данных для передачи в API
	package() {
		this.dateStart = moment(this._dateStart).utc().add(moment().utcOffset(),'minutes').format();
		this.dateEnd = moment(this._dateEnd).utc().add(moment().utcOffset(),'minutes').format();
		return this;
	}

	// Обновление данных, после сохранения
	compile(response) {
		console.log('response',response);
		this.revision = response.value.revision;
		this.calendarItemId = response.value.id;
		this.index = Number(`${this.calendarItemId}${this.revision}`);
	}
}