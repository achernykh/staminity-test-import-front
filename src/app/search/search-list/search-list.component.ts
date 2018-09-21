import './search-list.component.scss';
import {IComponentOptions, IComponentController, IScope, ILocationService, copy} from 'angular';
import {StateService} from "angular-ui-router";
import {SearchParams} from "@api/search";
import {SearchResultByUser, SearchResultByGroup} from "../search";
import {SearchService} from "@app/search/search.service";
import MessageService from "../../core/message.service";
import AuthService from "@app/auth/auth.service";
import {gtmFindCoach} from "../../share/google/google-analitics.functions";

class SearchListCtrl implements IComponentController {

    searchParams: SearchParams | Array<SearchParams>;
    cardView: boolean;
    update: number;
    limit: number = 50;
    excludeOwner: number;
    onEvent: (response: Object) => Promise<void>;

    // private
    private dynamicItems: DynamicItems;
    private items: Array<SearchResultByUser | SearchResultByGroup> = [];
    private isLoadingData: boolean = false;

    static $inject = ['$scope', '$mdMedia', '$state', '$location', 'SearchService' , 'message', 'AuthService'];
    constructor(private $scope: IScope,
                private $mdMedia,
                private $state: StateService,
                private $location: ILocationService,
                private searchService: SearchService,
                private message: MessageService,
                private auth: AuthService) {

    }

    $onInit() {
    }

    $onChanges (changes): void {
        if (this.searchParams && changes.hasOwnProperty('update')) {
            this.prepareData();
        }
    }

    prepareData () {
        if (this.searchParams.hasOwnProperty('activityTypes') &&
            (this.searchParams as SearchParams).activityTypes.length === 0) {
            (this.searchParams as SearchParams).activityTypes = undefined;
        }
        if (this.cardView) {
            this.isLoadingData = true;
            Promise.all([...(this.searchParams as Array<any>)
                .map(p => this.searchService.request('byParams', p, this.limit, 0))])
                .then(result => this.items = [].concat(...result), e => {debugger;})
                .then(_ => this.isLoadingData = false)
                .then(_ => this.$scope.$applyAsync());

        } else {
            this.dynamicItems = new DynamicItems(this.searchService, this.searchParams);
        }
    }

    get isLoadingState (): boolean {
        return (!this.cardView && this.dynamicItems.isLoadingData) ||
            (this.cardView && this.isLoadingData);
    }

    get isEmptyState (): boolean {
        return (this.cardView && !this.isLoadingData && this.items.length === 0) ||
            (!this.cardView && !this.dynamicItems.isLoadingData && this.dynamicItems.numItems === 0);
    }

    get isDataState (): boolean {
        return !this.isLoadingState && !this.isEmptyState;
    }

    profile (item): void {
        gtmFindCoach(item.name);
        this.$state.go(item.groupId ? 'club': 'user', {uri: item.uri});
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
    /**
     * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
     */
    loadedPages = {};
    /** @type {number} Total number of items. */
    numItems = 0;
    isLoadingData: boolean = false;
    private limit: number;

    constructor(
        private searchService: SearchService,
        private params: SearchParams,
        limit: number = 50) {
        this.limit = copy(limit);
    }
    // Required.
    getItemAtIndex (index) {
        var pageNumber = Math.floor(index / this.limit);
        var page = this.loadedPages[pageNumber];

        if (page) {
            return page[index % this.limit];
        } else if (page !== null) {
            this.fetchPage(pageNumber);
        }
    };
    // Required.
    getLength () { return this.numItems + 5; };

    fetchPage (pageNumber) {
        // Set the page to null so we know it is already being fetched.
        this.loadedPages[pageNumber] = null;
        // For demo purposes, we simulate loading more items with a timed
        // promise. In real code, this function would likely contain an
        // $http request.
        this.isLoadingData = true;
        this.loadedPages[pageNumber] = [];
        let pageOffset = pageNumber * this.limit;

        this.searchService.request('byParams', this.params, this.limit, pageOffset)
            .then(result => {
                this.loadedPages[pageNumber] = result;
                this.numItems = this.numItems + result.length;
            }, e => {debugger;})
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


