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

@NgModule({
    imports: [
        CommonModule,
        MaterialModule],
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
    ],
    exports: [
        ApplicationComponent
    ],
    providers: [
        LoaderService,

        // use some pipes as service
        ImagePipe,
        UserBackgroundPipe,
    ]
})
export class ShareModule {}