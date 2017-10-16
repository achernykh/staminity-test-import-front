import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NewPageDialogService } from "./new-page.service";
import { UserService } from "../core/user.service";

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
        private userService: UserService) {

        translate.addLangs(['en', 'ru']);
        translate.setDefaultLang('en');
        translate.use('en');
        translate.setTranslation('en', {
            HELLO: 'hello {{value}}'
        });
    }

    ngOnInit() {
        this.newPageDialog.print('some text');
        this.userService.getConnections().then( result => {}, error => {});
    }

    ngOnDestroy() {

    }
}