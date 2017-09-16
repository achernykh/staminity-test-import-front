import './search.component.scss';
import {IComponentOptions, IComponentController, IPromise, IScope, ILocationService} from 'angular';
import {SearchService} from "./search.service";
import {
    SearchParams, SearchResultByUser, SearchMethod,
    SearchResultByGroup
} from "../../../api/search/search.interface";
import * as _connection from "../core/env.js";
import MessageService from "../core/message.service";

class SearchCtrl implements IComponentController {

    public data: any;
    public readonly method:SearchMethod = 'byParams';

    public params: SearchParams = {objectType: 'user'};
    public type: Array<string> = ['user','coach','club'];//,'club','group'];
    public result: Array<SearchResultByUser | SearchResultByGroup>;
    public order: string = 'name';

    public options:Object = {
        rowSelection: false,
        multiSelect: false,
        autoSelect: false,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: false,
        pageSelect: false
    };

    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['$scope','$stateParams','$location','search','message'];

    constructor(private $scope: IScope,
                private $stateParams: any,
                private $location: ILocationService,
                private search: SearchService,
                private message: MessageService) {

    }

    $onInit() {
        this.$scope['order'] = 'name';
        let urlSearch = this.$location.search();
        if(urlSearch && urlSearch.hasOwnProperty('objectType') && urlSearch.objectType) {
            this.params = urlSearch;
            this.onSearch(this.params);
        }
        this.updateUrl(this.params);
    }

    onDetails(uri:string, url: string = `${window.location.origin}/`) {

        switch (this.params.objectType) {
            case 'user': case 'coach': {
                let win = window.open(`${url}user/${uri}`, '_blank');
                win.focus();
                break;
            }
            case 'club': {
                let win = window.open(`${url}club/${uri}`, '_blank');
                win.focus();
                break;
            }
        }
    }

    onSearch(params: SearchParams) {
        this.search.request(this.method, params)
            .then(result => this.result = result)
            .then(() => !this.$scope.$$phase && this.$scope.$apply())
            .then(() => this.message.toastInfo('searchResult',{count: this.result.length}));
    }

    changeQuery(param: string){
        if (['objectType'].indexOf(param) !== -1) {
            this.result = [];
        }
        this.updateUrl(this.params);
    }

    updateUrl(params: SearchParams){
        this.$location.search(params);
    }
}

const SearchComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: SearchCtrl,
    template: require('./search.component.html') as string
};

export default SearchComponent;