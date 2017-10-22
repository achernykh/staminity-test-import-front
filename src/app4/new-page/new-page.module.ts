import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIRouterModule } from '@uirouter/angular';
import { NewPageComponent } from './new-page.component';
import { newPageState } from './new-page.states';
import { NewPageDialogService } from "./new-page.service";
import { CoreModule } from "../core/core.module";
import { MaterialModule } from "../share/material.module";
import { ShareModule } from "../share/share.module";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from '@angular/common/http';

export function configTranslate(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, "./assets/i18n/page/", ".json");
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forChild({
            loader: { provide: TranslateLoader, useFactory: configTranslate, deps: [ HttpClient ] }
        }),
        UIRouterModule.forChild({ states: [ newPageState ] }),
        MaterialModule,
        CoreModule,
        ShareModule
    ],
    providers: [ NewPageDialogService ],
    declarations: [ NewPageComponent ],
})
class NewPage {}

export { NewPage };