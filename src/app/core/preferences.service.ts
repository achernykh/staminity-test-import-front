import { Observable, Subject } from "rxjs/Rx";

import { ISocketService } from '../core/socket.service';
import { ISessionService } from '../core/session.service';


export default class PreferencesService {

	private locale: string;

	static $inject = ['$translate', 'SessionService'];

	constructor (
		private $translate: any, 
		private SessionService: ISessionService
	) {
		this.setLocale('en');
	}

	getLocale () : string {
		return this.locale;
	}
	
	setLocale (locale: string) {
		this.$translate.preferredLanguage(locale);
		this.locale = locale;
	}
}
