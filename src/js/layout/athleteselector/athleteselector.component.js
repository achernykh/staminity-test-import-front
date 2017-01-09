//import { UserMenuSettings, AppMenuSettings } from '../app.constants';

class AthleteSelectorCtrl {
    constructor() {
        'ngInject';

        this.athletes = [
            {
                userProfile: {
                    userId: 12,
                    public: {
                        firstName: 'Александр',
                        lastName: 'Черных',
                        uri: ''
                    }
                }
            },
            {
                userProfile: {
                    userId: 13,
                    public: {
                        firstName: 'Захаринский',
                        lastName: 'Евгений',
                        uri: ''
                    }
                }
            }
        ]

    }

    /**
     *
     * @param athlete
     */
    select(athlete){
        console.log('AthleteSelector: select=', athlete);
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