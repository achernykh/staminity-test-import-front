import moment from "moment/min/moment-with-locales.js";
import { path } from "../share/utility/path";
import { getUser, ISession, SessionService } from "./index";
import UserService from "./user.service";
import {IHttpService} from "angular";
import { landingTariffsConfig } from "../landingpage/landing-tariffs/landing-tariffs.constants";
import { BehaviorSubject, Observable } from "rxjs/Rx";

export interface GeoInfo {
    /**city: string;
    country: {
        code: string;
        name: string;
    };
    ip: string;
    location: {
        time_zone: string;
    };**/
    city: string;
    country_name: string;
    country_code2: string;
    time_zone: {
        name: string;
    };
}

const getDisplay = (session: ISession): string => path([getUser, "display"])(session) || {};
const getLocale = (session: ISession): string => path([getUser, "display", "language"])(session) || (window.navigator.language as string).substring(0,2) || "ru";
const getUnits = (session: ISession): string => path([getUser, "display", "units"])(session) || "metric";
const getTimezone = (session: ISession): string => path([getUser, "display", "timezone"])(session) || "+00:00";
const getFirstDayOfWeek = (session: ISession): number => path([getUser, "display", "firstDayOfWeek"])(session) || 0;
const getCurrencyCode = (country: string): string =>
    Object.keys(landingTariffsConfig.currency).filter(curr => landingTariffsConfig.currency[curr].some(c => c === country.toUpperCase()))[0] ||
    landingTariffsConfig.defaultCurrency;

export default class DisplayService {

    locales = { ru: "Русский", en: "English",};
    ipData: GeoInfo;
    lng: BehaviorSubject<string>;


    static $inject = ["SessionService", "UserService", "$translate", "tmhDynamicLocale", "$mdDateLocale", '$http'];

    constructor (private sessionService: SessionService,
                 private userService: UserService,
                 private $translate: any,
                 private tmhDynamicLocale: any,
                 private $mdDateLocale: any,
                 private $http: IHttpService) {

        this.lng = new BehaviorSubject<string>(this.getLocale());

        sessionService.getObservable()
            .map(getDisplay)
            .distinctUntilChanged()
            .subscribe(this.handleChanges);

        if (!this.sessionService.getUser().display) {
            this.getIpInfo().then(r => r && (this.ipData = r));
        }

        // https://www.w3.org/TR/2016/CR-orientation-event-20160818/
        /**window.addEventListener("deviceorientation", (e: DeviceOrientationEvent) => {
            console.debug('deviceorientation', e);
            if (Math.abs(e.gamma) === 0) {
                // portait
            }
            if (Math.abs(e.gamma) === -90) {
                // landscape
            }
            // process event.alpha, event.beta and event.gamma
        }, true);**/
    }

    getLngObservable (): Observable<string> {
        return this.lng.asObservable();
    }

    getIpInfo (): Promise<GeoInfo> {
        return this.ipData ?
            Promise.resolve(this.ipData) :
            this.$http.get('https://api.ipgeolocation.io/ipgeo?apiKey=e01132e754f943f6b338cfff8ba86f96').then(result => result.data || {});
            //this.$http.get('https://geoip.nekudo.com/api').then(result => result.data || {});
    }

    getCurrency (): Promise<string> {
        return this.sessionService.getToken() && this.sessionService.get().userProfile.personal.country ?
            Promise.resolve(getCurrencyCode(this.sessionService.get().userProfile.personal.country)) :
            this.getIpInfo().then(r => getCurrencyCode(r.country_code2));
    }

    getLocale (): string {
        return this.sessionService.getToken() ?
            getLocale(this.sessionService.get()) :
            this.$translate.use() || (window.navigator.language as string).substring(0,2) || "en";
    }

    setLocale(locale: string): Promise<any> {
        const displayChanges = { language: locale };
        this.lng.next(locale);
        return this.sessionService.getToken() ?
            this.saveDisplaySettings(displayChanges as any) :
            Promise.resolve(this.$translate.use(locale));
    }

    getUnits (): string {
        return getUnits(this.sessionService.get());
    }

    setUnits(units: string): Promise<any> {
        return this.saveDisplaySettings({ units });
    }

    getTimezone (): string {
        return getTimezone(this.sessionService.get());
    }

    setTimezone(timezone: string): Promise<any> {
        return this.saveDisplaySettings({ timezone });
    }

    getFirstDayOfWeek (): number {
        return getFirstDayOfWeek(this.sessionService.get());
    }

    setFirstDayOfWeek(firstDayOfWeek: number): Promise<any> {
        return this.saveDisplaySettings({ firstDayOfWeek });
    }

    set ipInfo (data: GeoInfo) {

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

    private handleChanges = () => {
        const locale = this.getLocale();
        const firstDayOfWeek = this.getFirstDayOfWeek();

        this.lng.next(locale);
        this.$translate.use(locale);
        this.tmhDynamicLocale.set(locale);

        console.debug('display service set:', locale, firstDayOfWeek);

        moment.locale(locale);
        moment.updateLocale(locale, {
            week: { dow: firstDayOfWeek },
            invalidDate: "",
        });

        this.$mdDateLocale.firstDayOfWeek = firstDayOfWeek;
        this.$mdDateLocale.shortDays = moment.weekdaysMin();
    }
}

export function configure ($translateProvider: any,
                           tmhDynamicLocaleProvider: any,
                           $mdDateLocaleProvider: any,) {
    tmhDynamicLocaleProvider.localeLocationPattern("/assets/locale/angular-locale_{{locale}}.js");
    $mdDateLocaleProvider.parseDate = (s) => moment(s, "L", true).toDate();
    $mdDateLocaleProvider.formatDate = (date) => moment(date).format("L");
}

configure.$inject = ["$translateProvider", "tmhDynamicLocaleProvider", "$mdDateLocaleProvider"];
