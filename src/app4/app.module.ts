import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { UIRouterUpgradeModule } from '@uirouter/angular-hybrid';
import { UIRouterModule } from '@uirouter/angular';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NewPage } from "./new-page/new-page.module";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { MaterialModule } from "./share/material.module";
import { Auth } from "./auth/auth.module";
import { Requests } from "./requests/requests.module";
import { Notifications } from "./notifications/notifications.module";

export function configTranslate(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, "./assets/i18n/app/", ".json");
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        // Provide Angular upgrade capabilities
        UpgradeModule,
        // Provides the @uirouter/angular-hybrid directives
        UIRouterUpgradeModule,
        // Provides the @uirouter/angular directives
        UIRouterModule,

        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useFactory: (configTranslate), deps: [ HttpClient ] }
        }),

        ShareModule,
        CoreModule,
        NewPage,
        MaterialModule,
        Auth,
        Requests,
        Notifications
    ]
}) export class RootModule {
    ngDoBootstrap() {
        /* no body: this disables normal (non-hybrid) Angular bootstrapping */
    }
}