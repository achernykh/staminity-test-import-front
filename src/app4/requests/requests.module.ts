import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { CoreModule } from "../core/core.module";
import { ShareModule } from "../share/share.module";
import { RequestsService } from "./requests.service";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        CoreModule,
        ShareModule
    ],
    providers: [ RequestsService ],
    declarations: []
})
class Requests {}
export { Requests }