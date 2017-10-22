import { NgModule } from '@angular/core';
import { LoaderService } from "./loader/loader.service";
import { ApplicationComponent } from './application/application.component';
import { MaterialModule } from "./material.module";
import { CommonModule } from "@angular/common";
import { ApplicationToolbarUserComponent } from "./application-toolbar-user/application-toolbar-user.component";
import { ImagePipe } from "./pipes/image.pipe";
import { UserPicComponent } from './user-pic/user-pic.component';
import { AvatarPipe } from "./pipes/avatar.pipe";
import { UserNamePipe } from "./pipes/user-name.pipe";
import { ApplicationMenuComponent } from "./application-menu/application-menu.component";
import { UserBackgroundPipe } from "./pipes/user-background.pipe";
import { DialogService, DialogAlert, DialogConfirm } from "./dialog/dialog.service";
import { MessageService } from "./message/message.service";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        MaterialModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (httpClient: HttpClient) =>
                    new TranslateHttpLoader(httpClient, "./assets/i18n/message/", ".json"),
                deps: [ HttpClient ]
            }
        }),
    ],
    declarations: [
        // general application frame
        ApplicationComponent,
        ApplicationToolbarUserComponent,
        ApplicationMenuComponent,
        UserPicComponent,
        UserBackgroundPipe,

        // pipes: images
        ImagePipe,
        AvatarPipe,
        UserNamePipe,

        // dialog
        DialogAlert,
        DialogConfirm,

    ],
    entryComponents: [
        // dialog
        DialogAlert,
        DialogConfirm,
    ],
    exports: [
        ApplicationComponent,
        DialogAlert,
        DialogConfirm,
    ],
    providers: [
        LoaderService,
        MessageService,
        DialogService,

        // use some pipes as service
        ImagePipe,
        UserBackgroundPipe,
    ]
})
export class ShareModule {}