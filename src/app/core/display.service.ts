import { merge } from "angular";
import moment from "moment/min/moment-with-locales.js";
import { Observable, Subject } from "rxjs/Rx";

import { IUserProfile } from "../../../api/user/user.interface";
import { path } from "../share/utility";
import { getUser, ISession, SessionService} from "./index";
import UserService from "./user.service";


let getDisplay = (session: ISession) : string => path([getUser, "display"]) (session) || {};
let getLocale = (session: ISession) : string => path([getUser, "display", "language"]) (session) || "ru";
let getUnits = (session: ISession) : string => path([getUser, "display", "units"]) (session) || "metric";
let getTimezone = (session: ISession) : string => path([getUser, "display", "timezone"]) (session) || "+00:00";
let getFirstDayOfWeek = (session: ISession) : number => path([getUser, "display", "firstDayOfWeek"]) (session) || 0;

export default class DisplayService {

	private handleChanges = () => {
		let locale = this.getLocale();
		let firstDayOfWeek = this.getFirstDayOfWeek();

		this.$translate.use(locale);
		this.tmhDynamicLocale.set(locale);

		moment.locale(locale);
		moment.updateLocale(locale, {
			week: { dow: firstDayOfWeek },
			invalidDate: "",
		});

		this.$mdDateLocale.firstDayOfWeek = firstDayOfWeek;
		this.$mdDateLocale.shortDays = moment.weekdaysMin();
	}

	public locales = {
		ru: "Русский",
		en: "English",
	};

	static $inject = ["SessionService", "UserService", "$translate", "tmhDynamicLocale", "$mdDateLocale"];

	constructor (
		private SessionService: SessionService,
		private UserService: UserService,
		private $translate: any, 
		private tmhDynamicLocale: any,
		private $mdDateLocale: any,
	) {
		SessionService.getObservable()
		.map(getDisplay)
		.distinctUntilChanged()
		.subscribe(this.handleChanges);
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
	$mdDateLocaleProvider: any,
) {
	tmhDynamicLocaleProvider.localeLocationPattern("/assets/locale/angular-locale_{{locale}}.js");
	
	$mdDateLocaleProvider.parseDate = (s) => moment(s, "L", true).toDate();
	$mdDateLocaleProvider.formatDate = (date) => moment(date).format("L");
}

configure.$inject = ["$translateProvider", "tmhDynamicLocaleProvider", "$mdDateLocaleProvider"];