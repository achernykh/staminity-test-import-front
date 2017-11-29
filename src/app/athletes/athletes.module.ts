import { module } from "angular";
import AthleteInvitationComponent from "./athlete-invitation/athlete-invitation.component";
import AthletesComponent from "./athletes.component.js";
import configure from "./athletes.config";

const Athletes = module("staminity.athletes", ["ngMaterial", "staminity.share"])
    .component("athletes", AthletesComponent)
    .component("athleteInvitation", AthleteInvitationComponent)
    .config(configure)
    .name;

export default Athletes;
