import { merge } from "angular";
import moment from "moment/min/moment-with-locales.js";
import { Observable, Subject } from "rxjs/Rx";

import { IUserProfile } from "../../../api/user/user.interface";
import { path } from "../share/utility/path";
import { getUser, ISession, SessionService} from "./index";
import UserService from "./user.service";

const getDisplay = (session: ISession): string => path([getUser, "display"]) (session) || {};
const getLocale = (session: ISession): string => path([getUser, "display", "language"]) (session) || "ru";
const getUnits = (session: ISession): string => path([getUser, "display", "units"]) (session) || "metric";
const getTimezone = (session: ISession): string => path([getUser, "display", "timezone"]) (session) || "+00:00";
const getFirstDayOfWeek = (session: ISession): number => path([getUser, "display", "firstDayOfWeek"]) (session) || 0;

export default class DisplayService {

    private handleChanges = () => {
        const locale = this.getLocale();
        const firstDayOfWeek = this.getFirstDayOfWeek();

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

    locales = {
        ru: "Русский",
        en: "English",
    };

    static $inject = ["SessionService", "UserService", "$translate", "tmhDynamicLocale", "$mdDateLocale"];

    constructor(
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

    getLocale(): string {
        return getLocale(this.SessionService.get());
    }

    setLocale(locale: string) {
        const userChanges = { display: { language: locale } };

        if (this.SessionService.getToken()) {
            this.UserService.putProfile(userChanges as any);
        } else {
            this.SessionService.updateUser(userChanges as any);
        }
    }

    getUnits(): string {
        return getUnits(this.SessionService.get());
    }

    setUnits(units: string) {
        const userChanges = { display: { units: units } };
        this.UserService.putProfile(userChanges as any);
    }

    getTimezone(): string {
        return getTimezone(this.SessionService.get());
    }

    setTimezone(timezone: string) {
        const userChanges = { display: { timezone: timezone } };
        this.UserService.putProfile(userChanges as any);
    }

    getFirstDayOfWeek(): number {
        return getFirstDayOfWeek(this.SessionService.get());
    }

    setFirstDayOfWeek(firstDayOfWeek: number) {
        const userChanges = { display: { firstDayOfWeek: firstDayOfWeek } };
        this.UserService.putProfile(userChanges as any);
    }
}

export function configure(
    $translateProvider: any,
    tmhDynamicLocaleProvider: any,
    $mdDateLocaleProvider: any,
) {
    tmhDynamicLocaleProvider.localeLocationPattern("/assets/locale/angular-locale_{{locale}}.js");

    $mdDateLocaleProvider.parseDate = (s) => moment(s, "L", true).toDate();
    $mdDateLocaleProvider.formatDate = (date) => moment(date).format("L");
}

configure.$inject = ["$translateProvider", "tmhDynamicLocaleProvider", "$mdDateLocaleProvider"];
