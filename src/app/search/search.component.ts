import {IComponentController, IComponentOptions, ILocationService, IPromise, IScope} from "angular";
import {
    SearchMethod, SearchParams
} from "../../../api/search/search.interface";
import MessageService from "../core/message.service";
import "./search.component.scss";
import {SearchService} from "./search.service";
import {IUserProfile} from "@api/user";
import {Subject} from "rxjs/Rx";
import AuthService from "@app/auth/auth.service";
import { saveUtmParams } from "../share/location/utm.functions";

export class SearchCtrl implements IComponentController {

    // bind
    data: any;
    readonly method: SearchMethod = "byParams";

    // public
    leftBarShow: boolean = true;
    rightBarShow: boolean = false;

    // private
    private user: IUserProfile;
    private searchParams: SearchParams = {};
    private destroy: Subject<any> = new Subject();
    private navBarStates: Array<string> = ['users','coaches'];
    private defaultState: string = 'coaches';
    private currentState: string = null;
    private stateParam: string = 'state';
    usersFilter: SearchParams = {};
    coachesFilter: SearchParams = {};
    coachesAndClubsFilter: Array<SearchParams>;
    private usersFilterChange: number = 0;
    private coachesFilterChange: number = 0;
    private clubsFilterChange: number = 0;
    private leftPanel: boolean;
    private cardView: boolean;
    private readonly urlStringKeys: Array<string> = ['objectType', 'name', 'country', 'city'];
    private readonly urlArrayKeys: Array<string> = ['activityTypes'];

    static $inject = ["$mdMedia", "$stateParams", "$location" , "AuthService", "SearchService", "message"];

    constructor(
                private $mdMedia,
                private $stateParams: any,
                private $location: ILocationService,
                private authService: AuthService,
                public searchService: SearchService,
                private message: MessageService) {

        saveUtmParams($location.search());
    }

    $onInit() {
        this.prepareStates();
        this.prepareUrlParams();
    }

    private prepareUrlParams (): void {
        let clearStateParams = {};
        Object.keys(this.$stateParams).map(k => this.$stateParams[k] && (clearStateParams[k] = this.$stateParams[k]));
        let search: Object = Object.assign({}, this.$location.search(), clearStateParams);
        this.urlStringKeys.map(p => this.currentFilter[p] = search[p] || null);
        this.urlArrayKeys.map(p => search[p] && (this.currentFilter[p] = Array.isArray(search[p]) ? search[p] : [search[p]]));

        this.leftPanel = search['leftPanel'] && JSON.parse(search['leftPanel']) || this.$mdMedia('gt-sm') ? true : false;
        this.cardView = search['cardView'] && JSON.parse(search['cardView']) || true;

        Object.assign(this.usersFilter, {objectType: 'user', sortBy: 'firstName', sortAsc: true});
        Object.assign(this.coachesFilter, {sortBy: 'athleteCount', sortAsc: false});
        this.coachesAndClubsFilter = [
            Object.assign({}, this.coachesFilter, {objectType: 'coach'}),
            Object.assign({}, this.coachesFilter, {objectType: 'club'})
        ];
    }

    get currentFilter (): SearchParams {
        return this[this.currentState + 'Filter'];
    }

    private prepareStates(param: string = this.stateParam): void {
        this.setState(this.$location.search()[param] || this.$stateParams[param] || this.defaultState);
    }

    private setState (state: string, param: string = this.stateParam): void {
        if (this.navBarStates.indexOf(state) === -1) { return; }
        if (this.currentState && this.currentState !== state) {
            Object.keys(this.$location.search())
                .map(k => !~['objectType', 'leftPanel'].indexOf(k) && this.$location.search(k, null));
        }
        this.currentState = state;
        if (this[state+'Filter']) {
            Object.keys(this[state+'Filter']).map(k => this.$location.search(k, this[state+'Filter'][k]));
        }
        this.$location.search(param, state);
    }

    private showLeftPanel (): boolean {
        return this.$mdMedia('gt-sm') && this.leftPanel;
    }

    private authCheck (): boolean {
        return this.authService.isAuthenticated();
    }

    changeUsersFilter (filter: SearchParams): void {
        this.usersFilter = filter;
        this.usersFilterChange++;
        Object.keys(this.usersFilter).map(k => this.$location.search(k, this.usersFilter[k]));
    }

    changeCoachesFilter (filter: SearchParams): void {
        this.coachesFilter = filter;
        this.coachesAndClubsFilter = [
            Object.assign({}, this.coachesFilter, {objectType: 'coach'}),
            Object.assign({}, this.coachesFilter, {objectType: 'club'})
        ];
        this.coachesFilterChange++;
        Object.keys(this.coachesFilter).filter(k => !~['sortBy','sortSrc']
            .indexOf(k)).map(k => this.$location.search(k, this.coachesFilter[k]));
    }

    filter (e: Event): void {
        if (this.$mdMedia('gt-sm')) {
            this.leftPanel = !this.leftPanel;
            this.$location.search('leftPanel', this.leftPanel);
        } else {
            //this.trainingPlanDialog.filter(e, this.storePlansFilter)
            //    .then(response => this.changeStorePlansFilter(response));
        }
    }

    showLeftBar (): boolean {
        return (this.leftPanel && this.$mdMedia('gt-sm')) || false;
    }

    view (): void {
        this.cardView = !this.cardView;
        this.$location.search('cardView', this.cardView);
    }
}

export const SearchComponent: IComponentOptions = {
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
