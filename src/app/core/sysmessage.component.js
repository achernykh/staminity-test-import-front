import './sysmessage.component.scss';

class SystemMessageCtrl {
    constructor($log, $timeout) {
        'ngInject';
        this._$log = $log;
        this._$timeout = $timeout;
    }
    $onInit(){
        this._$log.debug('SystemMessage: onInit()');
        this._$timeout(() => this.show = false, (this.delay || 10) * 10000);

    }
    $onChange(changes) {
        this._$log.debug('SystemMessage: onChange()', changes);
    }
    close(){
        this._$log.debug('SystemMessage: close()');
        this.show = false;
    }
}

SystemMessageCtrl.$inject = ['$log','$timeout'];


let SystemMessageComponent = {
    bindings: {
        show: '=',
        status: '=',
        code: '=',
        delay: '<'
    },
    require:{
//      application: '^staminityApplication'
    },
    transclude: false,
    controller: SystemMessageCtrl,
    template: require('./sysmessage.component.html')
};

export default SystemMessageComponent;