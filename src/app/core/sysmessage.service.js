import {element} from 'angular';

export class SystemMessageService {

    constructor($compile, $timeout, $rootScope){
        this.count = 0;
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
    }
    /**
     * Выврдим на экран системное сообщение (system message). Для вывода на экран используется компонент system-message
     * с входящими параметрами show=$ctrl.message.show и message=$ctrl.message. Через наследование require данная
     * функция может быть вызвана в любом последующем контроллере через this.showMessage = this.parent.showMessage или
     * через прямой вызов this.parent.showMessage
     * @param message{show, status, title, text, delay}
     */
    show(code, status = 'error', delay = 10){
        //debugger;
        let id = "appmes#" + ++this.count;
        //let delay = message.delay || 10;
        //let status = message.status || 'error';
        element(document.getElementsByTagName('staminity-application'))
            .append(this.$compile(`<system-message id='+id+' show="true" status="${status}" code="${code}" delay="${delay}'/>`)
        (this.$rootScope));

        if(!this.$rootScope.$$phase)
            this.$rootScope.$apply();

        this.$timeout(
            () => angular.element(document.getElementById(id)).remove(), ++delay * 1000);
    }
}
SystemMessageService.$inject = ['$compile','$timeout','$rootScope'];

export default SystemMessageService;