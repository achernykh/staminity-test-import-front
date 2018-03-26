import { module } from "angular";
import { StateProvider } from "angular-ui-router";
import SearchComponent from "./search.component";
import configure from "./search.config";
import {SearchService} from "./search.service";
import {SearchFilterComponent} from "./search-filter/search-filter.component";
import {searchState} from "./search.states";
import {supportLng} from "../core/display.constants";
import {_translateSearch} from "./search.translate";
import {SearchListComponent} from "./search-list/search-list.component";

const Search = module("staminity.search", [])
    .service("SearchService", SearchService)
    .component("stSearch", SearchComponent)
    .component("stSearchFilter", SearchFilterComponent)
    .component("stSearchList", SearchListComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => searchState.map(s => $stateProvider.state(s))])
    .config(['$translateProvider', ($translate) =>
        supportLng.map(lng => $translate.translations(lng, {search: _translateSearch[lng]}))])
    .name;

export default Search;
