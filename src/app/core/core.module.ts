import { NgModule } from '@angular/core';
import { StorageService } from "./storage.service";
import { SessionService } from "./session.service";
import { SocketService } from './socket.service';
import { ConnectionSettingsConfig, ConnectionSettings } from './socket.config';


@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        {
            provide: ConnectionSettingsConfig,
            useValue: ConnectionSettings
        },
        StorageService,
        SessionService,
        SocketService
    ]
})
export class CoreModule { }
