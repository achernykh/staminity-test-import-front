import { module } from 'angular';
import configure from './search.config';
import SearchComponent from "./search.component";
import {SearchService} from "./search.service";

const Search = module('staminity.search', [])
    .service('search', SearchService)
    .component('search', SearchComponent)
    .config(configure)
    .name;

export default Search;