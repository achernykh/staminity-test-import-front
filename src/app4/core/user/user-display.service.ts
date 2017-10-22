import { Injectable } from "@angular/core";
import moment from 'moment/min/moment-with-locales.js';
import { SessionService, ISession, getUser} from '../session/session.service';
import { UserProfileService } from './user-profile.service';
import { path } from '../../share/utilities/path';
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';

let getDisplay = (session: ISession) : string => path([getUser, 'display']) (session) || {};
let getLocale = (session: ISession) : string => path([getUser, 'display', 'language']) (session) || 'ru';
let getUnits = (session: ISession) : string => path([getUser, 'display', 'units']) (session) || 'metric';
let getTimezone = (session: ISession) : string => path([getUser, 'display', 'timezone']) (session) || '+00:00';
let getFirstDayOfWeek = (session: ISession) : number => path([getUser, 'display', 'firstDayOfWeek']) (session) || 0;

@Injectable()
export class UserDisplayService {

    private handleChanges = () => {
        let locale = this.getLocale();
        let firstDayOfWeek = this.getFirstDayOfWeek();

        this.translate.use(locale);
        //this.tmhDynamicLocale.set(locale);

        moment.locale(locale);
        moment.updateLocale(locale, {
            week: { dow: firstDayOfWeek },
            invalidDate: ''
        });

        //this.$mdDateLocale.firstDayOfWeek = firstDayOfWeek;
        //this.$mdDateLocale.shortDays = moment.weekdaysMin();
    }

    private defaultTranslateLanguage: string = 'ru';

    public locales = {
        ru: 'Русский',
        en: 'English'
    };

    private translateModules: Array<string> = ['app','page'];

    constructor (
        private session: SessionService,
        private userProfileService: UserProfileService,
        private translate: TranslateService,
        private http: HttpClient
        //private tmhDynamicLocale: any,
        //private $mdDateLocale: any
    ) {
        session.getObservable()
            .map(getDisplay)
            .distinctUntilChanged()
            .subscribe(this.handleChanges);
    }

    init() : Promise<any> {
        this.translate.addLangs(Object.keys(this.locales));
        this.translate.use(this.translate.getBrowserLang());
        this.translate.setDefaultLang(this.defaultTranslateLanguage);

        let loader: Array<Promise<any>> = [];

        this.translateModules.map(module =>
            Object.keys(this.locales).map(lng =>
                loader.push(this.http.get(`./assets/i18n/${module}/${lng}.json`).toPromise()
                    .then(res => this.translate.setTranslation(lng, res, true)))));

        //let p1 = this.http.get(`./assets/i18n/page/en.json`).toPromise().then(res => this.translate.setTranslation('en',res,true));
        //let p2 = this.http.get(`./assets/i18n/page/ru.json`).toPromise().then(res => this.translate.setTranslation('ru',res,true));

        return Promise.all(loader);

    }

    getLocale () : string {
        return getLocale(this.session.get());
    }

    setLocale (locale: string) {
        let userChanges = { display: { language: locale } };

        if (this.session.getToken()) {
            this.userProfileService.putProfile(<any>userChanges);
        } else {
            this.session.updateUser(<any>userChanges);
        }
    }

    getUnits () : string {
        return getUnits(this.session.get());
    }

    getTimezone () : string {
        return getTimezone(this.session.get());
    }

    getFirstDayOfWeek () : number {
        return getFirstDayOfWeek(this.session.get());
    }
}