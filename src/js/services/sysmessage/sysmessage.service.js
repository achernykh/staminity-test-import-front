export default class ApplicationMessageService {
    constructor($compile, $timeout, $rootScope){
        'ngInject';
        this.count = 0;
        this._$compile = $compile;
        this._$timeout = $timeout;
        this._$rootScope = $rootScope;
    }
    /**
     * Выврдим на экран системное сообщение (system message). Для вывода на экран используется компонент system-message
     * с входящими параметрами show=$ctrl.message.show и message=$ctrl.message. Через наследование require данная
     * функция может быть вызвана в любом последующем контроллере через this.showMessage = this.parent.showMessage или
     * через прямой вызов this.parent.showMessage
     * @param message{show, status, title, text, delay}
     */
    show(message){
        let id = "appmes#" + ++this.count;
        let delay = message.delay || 10;
        angular
            .element(document.getElementsByTagName('staminity-application'))
            .append(this._$compile(
                '<system-message id='+id+' show="true" status="\'' + message.status +
                '\'" title="\'' + message.title +
                '\'" text="\'' + message.text +
                '\'" delay="\'' + delay +
                '\'"/>')(this._$rootScope));

        if(!this._$rootScope.$$phase)
            this._$rootScope.$apply();

        this._$timeout(
            () => angular.element(document.getElementById(id)).remove(), ++delay * 1000);
    }
}