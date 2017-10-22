import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewPageDialogService } from "./new-page.service";
import { UserConnectionsService } from "../core";
import { TranslateService } from "@ngx-translate/core";
import { IUserConnections } from "../../../api/user/user.interface";

@Component({
    selector: 'new-page',
    providers: [],
    template: require('./new-page.component.html') as string,
    styles: [require('./new-page.component.scss').toString()]
})
export class NewPageComponent implements OnInit, OnDestroy{

    public param: Object = {value: ', World!'};
    public actions: string = 'some actions';
    connections: IUserConnections;

    constructor(
        private newPageDialog: NewPageDialogService,
        private userConnectionsService: UserConnectionsService,
        private translate: TranslateService
    ) {

    }

    ngOnInit() {
        this.newPageDialog.print('some text');
        this.userConnectionsService.getConnections()
            .then( result => this.connections = result, error => {});
    }

    ngOnDestroy() {

    }
}