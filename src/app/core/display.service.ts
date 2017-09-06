import { Observable, Subject } from "rxjs/Rx";
import moment from 'moment/min/moment-with-locales.js';

import { IStorageService } from '../core/storage.service';


export default class DisplayService {

	public locales = {
		ru: 'Русский',
		en: 'English'
	};

	static $inject = ['storage', '$translate', 'tmhDynamicLocale', '$mdDateLocale'];

	constructor (
		private StorageService: IStorageService,
		private $translate: any, 
		private tmhDynamicLocale: any,
		private $mdDateLocale: any
	) {
		this.setLocale(this.getLocale());
		this.setFirstDayOfWeek(1);
	}

	getLocale () : string {
		return this.StorageService.get('locale', false) || 'ru';
	}
	
	setLocale (locale: string) {
		this.StorageService.set('locale', locale, false);

		this.$translate.use(locale);
		this.tmhDynamicLocale.set(locale);
		moment.locale(locale);
	}

	getFirstDayOfWeek () : number {		
		return this.$mdDateLocale.firstDayOfWeek;
	}
	
	setFirstDayOfWeek (day: number) {
		this.$mdDateLocale.firstDayOfWeek = day;
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