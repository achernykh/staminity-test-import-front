import {NgModule, Provider} from '@angular/core';
import { StorageService } from "./storage.service";
import { SessionService } from "./session.service";
import { SocketService } from './socket.service';
import {ConnectionSettings, ConnectionSettingsConfig} from './socket.config';
import { UserService } from "./user.service";


@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        StorageService,
        { provide: ConnectionSettingsConfig, useValue: ConnectionSettings },
        SessionService,
        SocketService,
        UserService
    ]
})
export class CoreModule { }
