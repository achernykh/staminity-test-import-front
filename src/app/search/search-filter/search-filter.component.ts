import './search-filter.component.scss';
import { IComponentOptions, IComponentController, IScope } from 'angular';
import {SearchParams} from "@api/search";

class SearchFilterCtrl implements IComponentController {

    // bind
    filter: SearchParams;
    view: string;
    onChangeFilter: (response: { filter: SearchParams }) => Promise<void>;

    constructor () {

    }

    $onInit () {
        //this.filter.activityTypes = this.filter.activityTypes || null;
    }

    private change (): void {
        this.onChangeFilter({filter: this.filter});
    }
}

export const SearchFilterComponent: IComponentOptions = {
    bindings: {
        view: '=',
        filter: '<',
        dialog: '=',
        onHide: '&',
        onChangeFilter: '&',
        onSearch: '&',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: SearchFilterCtrl,
    template: require('./search-filter.component.html') as string
};

