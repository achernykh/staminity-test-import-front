import { module } from 'angular';
import configure from './search.config';
import SearchComponent from "./search.component";

const Search = module('staminity.search', [])
    .component('search', SearchComponent)
    .config(configure)
    .name;

export default Search;