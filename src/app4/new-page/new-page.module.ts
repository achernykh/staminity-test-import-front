import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIRouterModule } from '@uirouter/angular';
import { NewPageComponent } from './new-page.component';
import { newPageState } from './new-page.states';
import { TranslateModule } from '@ngx-translate/core';
import { NewPageDialogService } from "./new-page.service";
import { CoreModule } from "../core/core.module";
import { MaterialModule } from "../share/material.module";
import { ShareModule } from "../share/share.module";


/** The NgModule for the Preferences feature */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
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