import {IComponentController, IComponentOptions, ILocationService, IPromise, IScope} from "angular";
import {
    SearchMethod, SearchParams, SearchResultByGroup,
    SearchResultByUser,
} from "../../../api/search/search.interface";
import * as _connection from "../core/env.js";
import MessageService from "../core/message.service";
import "./search.component.scss";
import {SearchService} from "./search.service";

export class SearchCtrl implements IComponentController {

    data: any;
    limit: number = 100;
    offset: number = 0;
    readonly method: SearchMethod = "byParams";

    params: SearchParams = {objectType: "user"};
    dataLoading: boolean = true;
    type: string[] = ["user", "coach", "club"]; //,'club','group'];
    result: Array<SearchResultByUser | SearchResultByGroup> = [];
    order: string = "name";

    options: Object = {
        rowSelection: false,
        multiSelect: false,
        autoSelect: false,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: false,
        pageSelect: false,
    };

    onEvent: (response: Object) => IPromise<void>;
    static $inject = ["$scope", "$stateParams", "$location", "search", "message"];

    constructor(public $scope: IScope,
                private $stateParams: any,
                private $location: ILocationService,
                public searchService: SearchService,
                private message: MessageService) {

    }

    $onInit() {
        this.$scope["order"] = "name";
        const urlSearch = this.$location.search();
        if (urlSearch && urlSearch.hasOwnProperty("objectType") && urlSearch.objectType) {
            this.params = urlSearch;
            this.search(this.params);
        }
        this.updateUrl(this.params);
    }

    onDetails(uri: string, url: string = `${window.location.origin}/`) {

        switch (this.params.objectType) {
            case "user": case "coach": {
                const win = window.open(`${url}user/${uri}`, "_blank");
                win.focus();
                break;
            }
            case "club": {
                const win = window.open(`${url}club/${uri}`, "_blank");
                win.focus();
                break;
            }
        }
    }

    search(params: SearchParams = this.params) {
        this.searchService.request(this.method, params, this.limit, this.offset)
            .then((result) => this.result = result)
            .then(() => !this.$scope.$$phase && this.$scope.$apply())
            .then(() => this.message.toastInfo("searchResult", {count: this.result.length}));
    }

    changeQuery(param: string) {
        if (["objectType"].indexOf(param) !== -1) {
            this.result = [];
        }
        this.updateUrl(this.params);
    }

    updateUrl(params: SearchParams) {
        this.$location.search(params);
    }
}

const SearchComponent: IComponentOptions = {
    bindings: {
        data: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: SearchCtrl,
    template: require("./search.component.html") as string,
};

export default SearchComponent;
