class SystemMessageCtrl {
    constructor($log, $timeout) {
        'ngInject';
        this._$log = $log;
        this._$timeout = $timeout;
    }
    $onInit(){
        this._$log.debug('SystemMessage: onInit()');
        this._$timeout(() => this.show = false, (this.delay || 10) * 1000);

    }
    $onChange(changes) {
        this._$log.debug('SystemMessage: onChange()', changes);
    }
    close(){
        this._$log.debug('SystemMessage: close()');
        this.show = false;
    }
}

let SystemMessage = {
    bindings: {
        show: '<',
        status: '<',
        code: '<',
        delay: '<'
    },
    require:{
//      application: '^staminityApplication'
    },
    transclude: false,
    controller: SystemMessageCtrl,
    templateUrl: 'layout/systemmessage/systemmessage.html'
};

export default SystemMessage;