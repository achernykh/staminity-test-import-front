import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../core/core.module";
import { ShareModule } from "../share/share.module";
import { MaterialModule } from "../share/material.module";
import { TranslateModule } from "@ngx-translate/core";
import { NotificationService } from "./notifications.service";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ShareModule,
        MaterialModule,
        TranslateModule,
    ],
    providers: [ NotificationService ],
    declarations: []
})
class Notifications {}
export { Notifications }