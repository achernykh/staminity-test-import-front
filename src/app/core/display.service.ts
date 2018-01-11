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
        private sessionService: SessionService,
        private userService: UserService,
        private $translate: any,
        private tmhDynamicLocale: any,
        private $mdDateLocale: any,
    ) {
        sessionService.getObservable()
        .map(getDisplay)
        .distinctUntilChanged()
        .subscribe(this.handleChanges);
    }

    getLocale(): string {
        return getLocale(this.sessionService.get());
    }

    setLocale(locale: string): Promise<any> {
        const displayChanges = { language: locale };

        return this.sessionService.getToken() ? (
            this.saveDisplaySettings(displayChanges as any)
        ) : (
            Promise.resolve(this.sessionService.updateUser(displayChanges as any))
        );
    }

    getUnits(): string {
        return getUnits(this.sessionService.get());
    }

    setUnits(units: string): Promise<any> {
        return this.saveDisplaySettings({ units });
    }

    getTimezone(): string {
        return getTimezone(this.sessionService.get());
    }

    setTimezone(timezone: string): Promise<any> {
        return this.saveDisplaySettings({ timezone });
    }

    getFirstDayOfWeek(): number {
        return getFirstDayOfWeek(this.sessionService.get());
    }

    setFirstDayOfWeek(firstDayOfWeek: number): Promise<any> {
        return this.saveDisplaySettings({ firstDayOfWeek });
    }

    private saveDisplaySettings(displayChanges: any): Promise<any> {
        let { userId, revision, display } = this.sessionService.getUser();
        return this.userService.putProfile({ 
            userId, revision,
            display: { 
                ...display,
                ...displayChanges,
            },
        })
        .then((result) => {
            this.sessionService.updateUser(result as any);
        });
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
