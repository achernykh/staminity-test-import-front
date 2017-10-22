import {NgModule, APP_INITIALIZER} from '@angular/core';
import { StorageService } from "./storage/storage.service";
import { SessionService } from "./session/session.service";
import { SocketService } from './socket/socket.service';
import { ConnectionSettings, ConnectionSettingsConfig } from './socket/socket.config';
import { UserProfileService } from "./user/user-profile.service";
import { RestService } from "./rest/rest.service";
import { GroupService } from "./group/group.service";
import { UserBillingService } from "./user/user-billing.service";
import { UserDisplayService } from "./user/user-display.service";
import { CommentService } from "./comment/commnet.service";
import { StatisticsService } from "./statistics/statistics.service";

function configSocket(socket: SocketService) {
    return  () => socket.init();
}

function configDisplay(display: UserDisplayService) {
    return () => display.init();
}


@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        StorageService,
        SocketService,
        { provide: APP_INITIALIZER, useFactory: configSocket, deps: [SocketService], multi: true },
        { provide: ConnectionSettingsConfig, useValue: ConnectionSettings },
        SessionService,
        RestService,
        UserProfileService,
        GroupService,
        UserDisplayService,
        { provide: APP_INITIALIZER, useFactory: configDisplay, deps: [UserDisplayService], multi: true },
        UserBillingService,
        CommentService,
        StatisticsService,
    ]
})
export class CoreModule { }
