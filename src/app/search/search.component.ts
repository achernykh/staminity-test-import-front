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

class SearchCtrl implements IComponentController {

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
    private navBarStates: Array<string> = ['user','coach','club'];
    private currentState: string = 'user';
    private stateParam: string = 'objectType';
    private usersFilter: SearchParams = {};
    private coachesFilter: SearchParams = {objectType: 'coach'};
    private clubsFilter: SearchParams = {objectType: 'club'};
    private usersFilterChange: number = 0;
    private coachesFilterChange: number = 0;
    private clubsFilterChange: number = 0;
    private leftPanel: boolean;
    private cardView: boolean;
    private readonly urlKeys: Array<string> = ['objectType', 'name', 'country', 'city', 'activityTypes'];

    static $inject = ["$mdMedia", "$stateParams", "$location" , "AuthService", "SearchService", "message"];

    constructor(
                private $mdMedia,
                private $stateParams: any,
                private $location: ILocationService,
                private authService: AuthService,
                private searchService: SearchService,
                private message: MessageService) {

    }

    $onInit() {
        this.prepareUrlParams();
        this.prepareStates();
    }

    private prepareUrlParams (): void {
        let clearStateParams = {};
        Object.keys(this.$stateParams).map(k => this.$stateParams[k] && (clearStateParams[k] = this.$stateParams[k]));
        let search: Object = Object.assign({}, this.$location.search(), clearStateParams);
        ['objectType', 'name'].map(p => this.currentFilter[p] = search[p] || null);
        //['objectType', 'name', 'country', 'city'].map(p => this.usersFilter[p] = search[p] || null);
        //['activityTypes'].map(p => search[p] && (this.usersFilter[p] = Array.isArray(search[p]) ? search[p] : [search[p]]));

        this.leftPanel = search['leftPanel'] || this.$mdMedia('gt-sm') ? true : false;
        this.cardView = search['cardView'] || true;

        Object.assign(this.usersFilter, {objectType: 'user'});
        Object.assign(this.coachesFilter, {objectType: 'coach'});
        Object.assign(this.clubsFilter, {objectType: 'club'});
    }

    get currentFilter (): SearchParams {
        if (this.currentState === 'user') {
            return this.usersFilter;
        } else if (this.currentState === 'coach') {
            return this.coachesFilter;
        }
    }

    private prepareStates(param: string = this.stateParam): void {
        this.setState(this.$location.search()[param] || this.$stateParams[param] || this.currentState);
    }

    private setState (state: string, param: string = this.stateParam): void {
        if (this.navBarStates.indexOf(state) === -1) { return; }
        if (this.currentState && this.currentState !== state) {
            Object.keys(this.$location.search())
                .map(k => !~['objectType', 'leftPanel'].indexOf(k) && this.$location.search(k, null));
        }
        this.currentState = state;
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
        this.coachesFilterChange++;
        Object.keys(this.coachesFilter).map(k => this.$location.search(k, this.coachesFilter[k]));
    }

    changeClubsFilter (filter: SearchParams): void {
        this.clubsFilter = filter;
        this.clubsFilterChange++;
        Object.keys(this.clubsFilter).map(k => this.$location.search(k, this.clubsFilter[k]));
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

    view (): void {
        this.cardView = !this.cardView;
        this.$location.search('cardView', this.cardView);
    }





    /*onDetails(uri: string, url: string = `${window.location.origin}/`) {

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

    onSearch(params: SearchParams) {
        this.search.request(this.method, params)
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
    }*/
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
