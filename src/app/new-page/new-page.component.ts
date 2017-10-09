import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NewPageDialogService } from "./new-page.service";

@Component({
    selector: 'new-page',
    providers: [ NewPageDialogService ],
    template: `

<mat-toolbar color="primary">
  <span>Custom Toolbar</span>

  <mat-toolbar-row>
    <span>Second Line</span>
    <span class="example-spacer"></span>
    <mat-icon class="example-icon">verified_user</mat-icon>
  </mat-toolbar-row>

  <mat-toolbar-row>
    <span>Third Line</span>
    <span class="example-spacer"></span>
    <mat-icon class="example-icon">favorite</mat-icon>
    <mat-icon class="example-icon">delete</mat-icon>
  </mat-toolbar-row>
</mat-toolbar>
                <div [translate]="'page.HELLO'" [translateParams]="param"></div>
                <div translate>page.GOODBYE</div>`,
})
export class NewPageComponent implements OnInit, OnDestroy{

    public param: Object = {value: ', World!'};

    constructor(private translate: TranslateService, private newPageDialog: NewPageDialogService) {
        translate.addLangs(['en', 'ru']);
        translate.setDefaultLang('en');
        translate.use('en');
        translate.setTranslation('en', {
            HELLO: 'hello {{value}}'
        });
    }

    ngOnInit() {
        this.newPageDialog.print('some text');
    }

    ngOnDestroy() {

    }
}