import ViewConstants from './app.service.constants';

export default class ApplicationService {
    constructor($log, $translate){
        'ngInject';
        this.count = 0;
        this._$log = $log;
        this._$translate = $translate;
        this.settings = ViewConstants;
        this.language = 'ru';
    }
    getParams(application){
        return angular.merge({}, this.settings[application],{
            header: {
                fullTitle:  'app.' + application + '.fullTitle',
                shortTitle: 'app.' + application + '.shortTitle'
            }
        });
    }

  setLanguage(language){
    this.language = language;
    this._$log.debug('ApplicationService: setLanguage', this.language);
    this._$translate.use(this.language);
    //TODO: add storage
  }
  getLanguage(){
    return this.language;
  }

}
