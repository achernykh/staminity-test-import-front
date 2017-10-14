import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIRouterModule } from '@uirouter/angular';
import { NewPageComponent } from './new-page.component';
import { newPageState } from './new-page.states';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { NewPageDialogService } from "./new-page.service";


/** The NgModule for the Preferences feature */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        UIRouterModule.forChild({ states: [ newPageState ] }),
        MatIconModule,
        MatToolbarModule
    ],
    providers: [ NewPageDialogService ],
    declarations: [ NewPageComponent ],
})
class NewPage {}

export { NewPage };