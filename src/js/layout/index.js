/**
 * Created by akexander on 22/07/16.
 */

import StaminityApplication from './application/application.component';
import { Background } from './application/background/background.component';
import { Header } from './application/header/header.component';
import UserMenu from './usermenu/usermenu.component';
import ApplicationMenu from './appmenu/appmenu.component';
import SystemMessage from './systemmessage/systemmessage.component';
import AthleteSelector from './athleteselector/athleteselector.component';

let layouteModule = angular.module('staminity.layout',[]);
    // TODO убрать после того как полностью заработает ui-router
    //layouteModule.value('$routerRootComponent', 'staminityApplication');
    layouteModule.component('staminityApplication', StaminityApplication);
    layouteModule.component('staminityBackground', Background);
    layouteModule.component('staminityHeader', Header);
    layouteModule.component('userMenu', UserMenu);
    layouteModule.component('applicationMenu', ApplicationMenu);
    //layouteModule.component('applicationHeader', ApplicationHeader);
    layouteModule.component('systemMessage', SystemMessage);
    layouteModule.component('athleteSelector', AthleteSelector);



export default layouteModule;
