import { Observable, Subject } from "rxjs/Rx";
import moment from 'moment/min/moment-with-locales.js';
import { merge } from 'angular';

import { IUserProfile } from '../../../api/user/user.interface';
import { ISessionService } from './session.service';
import UserService from './user.service';
import { path } from '../share/utility';


let getLocale = (userProfile: IUserProfile) : string => path(['display', 'language']) (userProfile) || 'ru';
let getFirstDayOfWeek = (userProfile: IUserProfile) : number => path(['display', 'firstDayOfWeek']) (userProfile) || 1;

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
		UserService.currentUser
		.map(getLocale)
		.distinctUntilChanged()
		.subscribe(this.handleLocaleChange);

		UserService.currentUser
		.map(getFirstDayOfWeek)
		.distinctUntilChanged()
		.subscribe(this.handleFirstDayOfWeekChange);
	}

	getLocale () : string {
		return getLocale(this.UserService.getCurrentUser());
	}

	setLocale (locale: string) {
		let userChanges = { display: { language: locale } };

		if (this.SessionService.getToken()) {
			this.UserService.updateCurrentUser(<any>userChanges);
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