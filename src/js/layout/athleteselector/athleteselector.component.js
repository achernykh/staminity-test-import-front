//import { UserMenuSettings, AppMenuSettings } from '../app.constants';

class AthleteSelectorCtrl {
    constructor($log, Groups) {
        'ngInject';
        this._Groups = Groups;
        this._$log = $log;
        //this.appmenu = AppMenuSettings;
        //this.usermenu = UserMenuSettings;
        //this._Auth = Auth;
    }
    /**
     * В инициализации контроллера запрашиваем группы для текущего пользователя
     */
    $onInit(){
        /*this._Groups.get().then(
            (response) => {
                this.athletes = response;
                this._$log.debug('AthleteSelector: onInit=', this.athletes);
            },
            (error) => {

            }
        )*/
    }

    /**
     *
     * @param athlete
     */
    select(athlete){
        this._$log.debug('AthleteSelector: select=', athlete);
        this.onSelect({athlete: athlete})
    }

}

let AthleteSelector = {
    bindings: {
        show: '<',
        user: '<',
        athlete: '<',
        onSelect: '&'
    },
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: AthleteSelectorCtrl,
    templateUrl: 'layout/athleteselector/athleteselector.html'
};
export default AthleteSelector;