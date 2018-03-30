import './search-filter.component.scss';
import { IComponentOptions, IComponentController } from 'angular';
import { SearchParams } from "@api/search";
import { _ACTIVITIES } from "../../settings-user/settings-user.constants";

class SearchFilterCtrl implements IComponentController {

    // bind
    filter: SearchParams;
    view: string;
    onChangeFilter: (response: { filter: SearchParams }) => Promise<void>;

    private activityTypes = _ACTIVITIES;

    constructor () {}

    $onInit () {
        this.filter.activityTypes = this.filter.activityTypes || [];
    }
    private change (): void {
        this.onChangeFilter({filter: this.filter});
    }

    private toggle (item: string, list: Array<string>): void {
        ~list.indexOf(item) ? list.splice(list.indexOf(item), 1) : list.push(item);
        this.change();
    }

    private exists (item: string, list: Array<string>): boolean {
        return list.indexOf(item) > -1;
    }

    private isIndeterminate (key: string) {
        return (this.filter[key].length !== 0 && this.filter[key].length !== this.activityTypes.length);
    };

    private isChecked (key: string) {
        return this.filter[key].length === this.activityTypes.length;
    };

    private toggleAll (key: string) {
        if (this.filter[key].length === this.activityTypes.length) {
            this.filter[key] = [];
            this.change();
        } else if (this.filter[key].length === 0 || this.filter[key].length > 0) {
            this.filter[key] = this.activityTypes.slice(0);
            this.change();
        }
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

