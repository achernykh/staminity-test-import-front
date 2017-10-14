import { Observable, Subject } from "rxjs/Rx";
import moment from 'moment/min/moment-with-locales.js';
import { merge } from 'angular';

import { IUserProfile } from '../../../api/user/user.interface';
import { ISessionService, ISession, getUser } from './session.service-ajs';
import UserService from './user.service-ajs';
import { path } from '../share/utility';


let getLocale = (session: ISession) : string => path([getUser, 'display', 'language']) (session) || 'ru';
let getFirstDayOfWeek = (session: ISession) : number => path([getUser, 'display', 'firstDayOfWeek']) (session) || 1;

export default class DisplayService {

	private handleLocaleChange = (locale: string) => {
		this.$translate.use(locale);
		this.tmhDynamicLocale.set(locale);
		moment.locale(locale);
		console.log('DisplayService locale', locale);
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
		private SessionService: ISessionService,
		private UserService: UserService,
		private $translate: any, 
		private tmhDynamicLocale: any,
		private $mdDateLocale: any
	) {
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