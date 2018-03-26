import './search-list.component.scss';
import {IComponentOptions, IComponentController, IScope, ILocationService} from 'angular';
import {StateService} from "angular-ui-router";
import {SearchParams} from "@api/search";
import {SearchResultByUser, SearchResultByGroup} from "../search";
import {SearchService} from "@app/search/search.service";
import MessageService from "../../core/message.service";

class SearchListCtrl implements IComponentController {

    searchParams: SearchParams;
    cardView: boolean;
    update: number;
    limit: number;
    excludeOwner: number;
    onEvent: (response: Object) => Promise<void>;

    // private
    private dynamicItems: DynamicItems;
    private items: Array<SearchResultByUser | SearchResultByGroup>;
    private isLoadingData: boolean = false;

    static $inject = ['$scope', '$mdMedia', '$state', '$location', 'SearchService' , 'message'];
    constructor(private $scope: IScope,
                private $mdMedia,
                private $state: StateService,
                private $location: ILocationService,
                private searchService: SearchService,
                private message: MessageService) {

    }

    $onInit() {
    }

    $onChanges (changes): void {
        if (this.searchParams && changes.hasOwnProperty('update')) {
            this.prepareData();
        }
    }

    prepareData () {
        //this.isLoadingData = true;
        this.dynamicItems = new DynamicItems(this.searchService, this.searchParams);
        /*this.searchService.request('byParams', this.searchParams)
            .then(result => this.items = result, e => {debugger;})
            .then(_ => this.isLoadingData = false);*/
    }

    get isLoadingState (): boolean {
        return this.dynamicItems.isLoadingData;
    }

    get isEmptyState (): boolean {
        return !this.dynamicItems.isLoadingData && (!this.dynamicItems || this.dynamicItems.items.length === 0);
    }

    get isDataState (): boolean {
        return !this.isLoadingState && !this.isEmptyState;
    }


}

export const SearchListComponent:IComponentOptions = {
    bindings: {
        searchParams: '<',
        cardView: '<',
        update: '<',
        limit: '<',
        excludeOwner: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: SearchListCtrl,
    template: require('./search-list.component.html') as string
};

// In this example, we set up our model using a class.
// Using a plain object works too. All that matters
// is that we implement getItemAtIndex and getLength.
class DynamicItems {

    numLoaded: number = 0;
    toLoad: number = 0;
    isLoadingData: boolean = false;
    items: Array<any> = [];
    offset: number = 0;

    constructor(
        private searchService: SearchService,
        private params: SearchParams,
        private limit: number = 50) {

    }
    // Required.
    getItemAtIndex (index) {
        if (index > this.numLoaded) {
            this.fetchMoreItems(index);
            return null;
        }
        return this.items[index];
    };
    // Required.
    // For infinite scroll behavior, we always return a slightly higher
    // number than the previously loaded items.
    getLength () { return this.items.length + 5; };

    fetchMoreItems (index) {
        this.isLoadingData = true;
        this.searchService.request('byParams', this.params, this.limit, this.offset)
            .then(result => this.items.push(...result), e => {debugger;})
            .then(_ => this.offset = this.offset + this.limit)
            .then(_ => this.isLoadingData = false);
    }

    fetchNumItems () {
        // For demo purposes, we simulate loading the item count with a timed
        // promise. In real code, this function would likely contain an
        // $http request.
        /**$timeout(angular.noop, 300).then(angular.bind(this, function() {
            this.numItems = 50000;
        }));**/
    }

}


