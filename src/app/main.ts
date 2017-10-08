// import polyfills
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

// import angular2 dpes
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { UpgradeModule } from '@angular/upgrade/static';

import { root } from './app.module';
import { RootModule } from './app4.module';
import { UrlService} from '@uirouter/core';

// Manually bootstrap the Angular app
platformBrowserDynamic().bootstrapModule(RootModule).then(platformRef => {
    const injector = platformRef.injector;
    const upgrade = injector.get(UpgradeModule) as UpgradeModule;

    // The DOM must be already be available
    upgrade.bootstrap(document.body, [root.name]);

    // Intialize the Angular Module (get() any UIRouter service from DI to initialize it)
    const url = injector.get(UrlService);

    // Instruct UIRouter to listen to URL changes
    url.listen();
    url.sync();
});