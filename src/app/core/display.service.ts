import { Observable, Subject } from "rxjs/Rx";
import moment from 'moment/min/moment-with-locales.js';
import { merge } from 'angular';

import { IUserProfile } from '../../../api/user/user.interface';
import { ISessionService, ISession, getUser } from './session.service';
import UserService from './user.service';
import { path } from '../share/utility';


let getLocale = (session: ISession) : string => path([getUser, 'display', 'language']) (session) || 'ru';
let getUnits = (session: ISession) : string => path([getUser, 'display', 'units']) (session) || 'metric';
let getTimezone = (session: ISession) : string => path([getUser, 'display', 'timezone']) (session) || '+00:00';
let getFirstDayOfWeek = (session: ISession) : number => path([getUser, 'display', 'firstDayOfWeek']) (session) || 0;

let setupMoment = (locale: string, firstDayOfWeek: number) => {
	moment.locale(locale);
	moment.updateLocale(locale, {
		week: { dow: firstDayOfWeek },
		invalidDate: ''
	});
};

export default class DisplayService {

	private handleLocaleChange = (locale: string) => {
		this.$translate.use(locale);
		this.tmhDynamicLocale.set(locale);
		setupMoment(locale, this.getFirstDayOfWeek());
	}

	private handleFirstDayOfWeekChange = (day: number) => {
		this.$mdDateLocale.firstDayOfWeek = day;
		setupMoment(this.getLocale(), day);
	}

	public locales = {
		ru: 'Русский',
		en: 'English'
	};

	static $inject = ['SessionService', 'UserService', '$translate', 'tmhDynamicLocale', '$mdDateLocale'];

	constructor (
		private SessionService: ISessionService,
		private UserService: UserService,
		private $translate: any, 
		private tmhDynamicLocale: any,
		private $mdDateLocale: any
	) {
		window['D'] = this;
		SessionService.getObservable()
		.map(getLocale)
		.distinctUntilChanged()
		.subscribe(this.handleLocaleChange);

		SessionService.getObservable()
		.map(getFirstDayOfWeek)
		.distinctUntilChanged()
		.subscribe(this.handleFirstDayOfWeekChange);
	}

	getLocale () : string {
		return getLocale(this.SessionService.get());
	}

	setLocale (locale: string) {
		let userChanges = { display: { language: locale } };

		if (this.SessionService.getToken()) {
			this.UserService.putProfile(<any>userChanges);
		} else {
			this.SessionService.updateUser(<any>userChanges);
		}
	}

	getUnits () : string {
		return getUnits(this.SessionService.get());
	}
	
	getTimezone () : string {
		return getTimezone(this.SessionService.get());
	}

	getFirstDayOfWeek () : number {
		return getFirstDayOfWeek(this.SessionService.get());
	}
}


export function configure (
	$translateProvider: any, 
	tmhDynamicLocaleProvider: any, 
	$mdDateLocaleProvider: any
) {
	tmhDynamicLocaleProvider.localeLocationPattern('/assets/locale/angular-locale_{{locale}}.js');
	
	$mdDateLocaleProvider.parseDate = (s) => moment(s, 'L', true).toDate();
	$mdDateLocaleProvider.formatDate = (date) => moment(date).format('L');
}

configure.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider', '$mdDateLocaleProvider'];