import { module } from 'angular';
import AthletesComponent from './athletes.component.js';
import configure from './athletes.config';
import AthleteInvitationComponent from "./athlete-invitation/athlete-invitation.component";

const Athletes = module('staminity.athletes', ['ngMaterial', 'staminity.share'])
    .component('athletes', AthletesComponent)
    .component('athleteInvitation', AthleteInvitationComponent)
    .config(configure)
    .name;

export default Athletes;
