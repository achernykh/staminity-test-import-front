import './search.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {SearchService} from "./search.service";
import {SearchParams, SearchResultByUser, SearchMethod} from "../../../api/search/search.interface";
import IScope = angular.IScope;

class SearchCtrl implements IComponentController {

    public data: any;
    public readonly method:SearchMethod = 'byParams';

    public params: SearchParams = {objectType: 'user'};
    public type: Array<string> = ['user','coach','club','group'];
    public result: Array<SearchResultByUser>;

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
    static $inject = ['$scope','search'];

    constructor(private $scope: IScope, private search: SearchService) {

    }

    $onInit() {

    }

    onSearch(params: SearchParams) {
        this.search.request(this.method, params).then(result => {debugger; console.log(result); this.result = result;});
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