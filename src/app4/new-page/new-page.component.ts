import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NewPageDialogService } from "./new-page.service";
import { UserConnectionsService } from "../core";

@Component({
    selector: 'new-page',
    providers: [],
    template: require('./new-page.component.html') as string,
    styles: [require('./new-page.component.scss').toString()]
})
export class NewPageComponent implements OnInit, OnDestroy{

    public param: Object = {value: ', World!'};
    public actions: string = 'some actions';

    constructor(
        private translate: TranslateService,
        private newPageDialog: NewPageDialogService,
        private userConnectionsService: UserConnectionsService) {

    }

    ngOnInit() {
        this.newPageDialog.print('some text');
        this.userConnectionsService.getConnections()
            .then( result => {}, error => {});
    }

    ngOnDestroy() {

    }
}