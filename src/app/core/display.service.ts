import { Observable, Subject } from "rxjs/Rx";
import moment from 'moment/min/moment-with-locales.js';
import { merge } from 'angular';

import { ISession, getUser, ISessionService } from './session.service';
import UserService from './user.service';
import { path } from '../share/utility';


let getLocale = (session: ISession) : string => path([getUser, 'display', 'language']) (session) || 'ru';
let getFirstDayOfWeek = (session: ISession) : number => path([getUser, 'display', 'firstDayOfWeek']) (session) || 1;

export default class DisplayService {

	private handleLocaleChange = (locale: string) => {
		this.$translate.use(locale);
		this.tmhDynamicLocale.set(locale);
		moment.locale(locale);
	}

	private handleFirstDayOfWeekChange = (day: number) => {
		this.$mdDateLocale.firstDayOfWeek = day;
	}

	public locales = {
		ru: 'Русский',
		en: 'English'
	};

	static $inject = ['SessionService', 'UserService', '$translate', 'tmhDynamicLocale', '$mdDateLocale'];

	constructor (
		private sessionService: ISessionService,
		private userService: UserService,
		private $translate: any, 
		private tmhDynamicLocale: any,
		private $mdDateLocale: any
	) {
		sessionService.getObservable()
		.map(getLocale)
		.distinct()
		.subscribe(this.handleLocaleChange);

		sessionService.getObservable()
		.map(getFirstDayOfWeek)
		.distinct()
		.subscribe(this.handleFirstDayOfWeekChange);
	}

	getLocale () : string {
		let session = this.sessionService.get();
		return getLocale(session);
	}

	setLocale (locale: string) {
		this.sessionService.updateUser({ display: { language: locale } });
		this.userService.putProfile(this.sessionService.getUser());
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

	moment.updateLocale('*', { invalidDate: '' });
}

configure.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider', '$mdDateLocaleProvider'];