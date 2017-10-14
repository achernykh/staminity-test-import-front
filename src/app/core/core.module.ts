import {NgModule, APP_INITIALIZER} from '@angular/core';
import { StorageService } from "./storage.service";
import { SessionService } from "./session.service";
import { SocketService } from './socket.service';
import {ConnectionSettings, ConnectionSettingsConfig} from './socket.config';
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
        { provide: APP_INITIALIZER, useFactory: configFactory, deps: [SocketService], multi: true },
        { provide: ConnectionSettingsConfig, useValue: ConnectionSettings },
        SessionService,
        SocketService,
        UserService
    ]
})
export class CoreModule { }
