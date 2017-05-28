import './sysmessage.component.scss';

class SystemMessageCtrl {
    constructor($log, $timeout) {
        this._$log = $log;
        this._$timeout = $timeout;
    }
    $onInit(){
        //console.log('SystemMessage: onInit()', this);
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

SystemMessageCtrl.$inject = ['$log','$timeout'];


let SystemMessageComponent = {
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
    template: require('./sysmessage.component.html')
};

export default SystemMessageComponent;