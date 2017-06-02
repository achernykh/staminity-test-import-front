import './search.component.scss';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import {SearchService} from "./search.service";
import {SearchParams, SearchResultByUser, SearchMethod} from "../../../api/search/search.interface";
import {_connection} from "../core/api.constants";

class SearchCtrl implements IComponentController {

    public data: any;
    public readonly method:SearchMethod = 'byParams';

    public params: SearchParams = {objectType: 'user'};
    public type: Array<string> = ['user','coach'];//,'club','group'];
    public result: Array<SearchResultByUser>;
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
    static $inject = ['$scope','search'];

    constructor(private $scope: IScope, private search: SearchService) {

    }

    $onInit() {
        this.$scope['order'] = 'name';
    }

    onDetails(uri:string, url: string = `${window.location.origin}/`) {
        debugger;
        switch (this.params.objectType) {
            case 'user': case 'coach': {
                let win = window.open(`${url}user/${uri}`, '_blank');
                win.focus();
            }
        }
    }

    onSearch(params: SearchParams) {
        this.search.request(this.method, params)
            .then(result => {debugger; console.log(result); this.result = result;})
            .then(() => !this.$scope.$$phase && this.$scope.$apply());
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