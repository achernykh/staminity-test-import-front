import {NgModule, Component} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { UIRouterUpgradeModule } from '@uirouter/angular-hybrid';
import { UIRouterModule } from '@uirouter/angular';

import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

@NgModule({
    imports: [
        BrowserModule,
        // Provide Angular upgrade capabilities
        UpgradeModule,
        // Provides the @uirouter/angular-hybrid directives
        UIRouterUpgradeModule,
        // Provides the @uirouter/angular directives
        UIRouterModule,
    ]
}) export class RootModule {
    ngDoBootstrap() {
        /* no body: this disables normal (non-hybrid) Angular bootstrapping */
    }
}