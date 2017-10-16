import {NgModule, APP_INITIALIZER} from '@angular/core';
import { StorageService } from "./storage/storage.service";
import { SessionService } from "./session/session.service";
import { SocketService } from './socket/socket.service';
import {ConnectionSettings, ConnectionSettingsConfig} from './socket/socket.config';
import { UserService } from "./user.service";

export function configFactory(socket: SocketService) {
    return  () => socket.init();
}


@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        StorageService,
        SocketService,
        { provide: APP_INITIALIZER, useFactory: configFactory, deps: [SocketService], multi: true },
        { provide: ConnectionSettingsConfig, useValue: ConnectionSettings },
        SessionService,
        UserService
    ]
})
export class CoreModule { }
