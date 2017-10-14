import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NewPageDialogService } from "./new-page.service";
import { UserService } from "../core/user.service";
import {SocketService} from "../core/socket.service";

@Component({
    selector: 'new-page',
    providers: [],
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
                <div translate>page.GOODBYE</div>

<mat-sidenav-container class="example-sidenav-fab-container">
  <mat-sidenav #sidenav mode="side" opened="true">
    <button mat-mini-fab class="example-fab" (click)="sidenav.toggle()">
      <mat-icon>add</mat-icon>
    </button>
    <div class="example-scrolling-content">
      Lorem ipsum dolor sit amet, pede a libero aenean phasellus, lectus metus sint ut risus,
      fusce vel in pellentesque. Nisl rutrum etiam morbi consectetuer tempor magna, aenean nullam
      nunc id, neque vivamus interdum sociis nulla scelerisque sem, dolor id wisi turpis magna
      aliquam magna. Risus accumsan hac eget etiam donec sed, senectus erat mattis quam, tempor
      vel urna occaecat cras, metus urna augue nec at. Et morbi amet dui praesent, nec eu at,
      ligula ipsum dui sollicitudin, quis nisl massa viverra ligula, mauris fermentum orci arcu
      enim fringilla. Arcu erat nulla in aenean lacinia ullamcorper, urna ante nam et sagittis,
      tristique vehicula nibh ipsum vivamus, proin proin. Porta commodo nibh quis libero amet.
      Taciti dui, sapien consectetuer.
    </div>
  </mat-sidenav>
  <button mat-mini-fab class="example-fab" (click)="sidenav.toggle()">
    <mat-icon>add</mat-icon>
  </button>
  <div class="example-scrolling-content">
    Lorem ipsum dolor sit amet, pede a libero aenean phasellus, lectus metus sint ut risus, fusce
    vel in pellentesque. Nisl rutrum etiam morbi consectetuer tempor magna, aenean nullam nunc id,
    neque vivamus interdum sociis nulla scelerisque sem, dolor id wisi turpis magna aliquam magna.
    Risus accumsan hac eget etiam donec sed, senectus erat mattis quam, tempor vel urna occaecat
    cras, metus urna augue nec at. Et morbi amet dui praesent, nec eu at, ligula ipsum dui
    sollicitudin, quis nisl massa viverra ligula, mauris fermentum orci arcu enim fringilla. Arcu
    erat nulla in aenean lacinia ullamcorper, urna ante nam et sagittis, tristique vehicula nibh
    ipsum vivamus, proin proin. Porta commodo nibh quis libero amet. Taciti dui, sapien
    consectetuer.
  </div>
</mat-sidenav-container>`,
})
export class NewPageComponent implements OnInit, OnDestroy{

    public param: Object = {value: ', World!'};

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
        this.userService.getConnections().then( result => {debugger;}, error => {debugger;});
    }

    ngOnDestroy() {

    }
}