const _apiRequest = {
    user: {
        getUserProfile: {
            uri: {
                element: 'input',
                type: 'text'
            }
        }
    },
    group: {
        getGroupProfile: {
            uri: {
                element: 'input',
                type: 'text'
            }
        },
        joinGroup: {
            groupId: {
                element: 'input',
                type: 'number'
            },
            userId: {
                element: 'input',
                type: 'number'
            }
        },
        leaveGroup: {
            groupId: {
                element: 'input',
                type: 'number'
            },
            userId: {
                element: 'input',
                type: 'number'
            }
        }
    }
}

class ApiCtrl {
    constructor(AuthService, SystemMessageService, ActionMessageService, $state, SocketService) {
        'ngInject'
        this._AuthService = AuthService;
        this._SystemMessageService = SystemMessageService;
        this._ActionMessageService = ActionMessageService;
        this._SocketService = SocketService;
        this._$state = $state;
        this.enabled = true;
        this.state = 'form';
        this.showConfirm = false;
        this.response = '{"token":"6ae16016-7f62-a0d5-67eb-a8e46a5002f0","userProfile":{"public":{"uri":30,"avatar":"30.jpg","background":"30.jpg","lastName":"testuser3_LN","firstName":"testuser3_FN"},"userId":30},"systemFunctions":{"user":null}}';
        this.response = JSON.parse(this.response);
        this.credentials = {
            public: {
                firstName: '',
                lastName: '',
                avatar: 'default.jpg',
                background: 'default.jpg'
            },
            email: 'testuser3@mail.ru',
            password: 'testuser3',
            personal: {
                role: true
            }
        };
        this._apiRequest = _apiRequest;
        this.request = {
            requestType: "",
            requestData: {}
        };

        this.response = null;


        this.obj = {data: {"Array": [1, 2, 3], "Boolean": true, "Null": null, "Number": 123, "Object": {"a": "b", "c": "d"}, "String": "Hello World"}, options: {mode: 'tree', expanded: true}};
        this.onLoad = function (instance) {
            instance.expandAll();
        }
    }

    send(){
        this.success = null;
        this.error = null;
        this.isEdited = false;
        return this._SocketService.send(this.request)
                    .finally(() => {
                        this._ActionMessageService.simple('Ответ получен. История запросов сохранена');
                        this.obj.options.expanded = true;
                    })
                    .then((success) => {
                        this.response = success
                    }, (error) => {
                        this.response = error
                        this._SystemMessageService.show(error);
                    })
    }

    editRequest(){
        this.isEdited = true;
        this.edit = JSON.stringify(this.requestBody);
    }

}

export let Api = {
    bindings: {
        view: '<'
    },
    transclude: false,
    controller: ApiCtrl,
    templateUrl: "api/api.html"
}