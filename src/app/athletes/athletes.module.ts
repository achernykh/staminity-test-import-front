import { module } from "angular";
import { StateProvider } from "@uirouter/angularjs";
import { supportLng } from "../core/display.constants";
import AthleteInvitationComponent from "./athlete-invitation/athlete-invitation.component";
import { translateAthleteInvitation } from "./athlete-invitation/athlete-invitation.translate";
import AthletesComponent from "./athletes.component";
import { AthletesService } from "./athletes.service";
import { athletesStates } from "./athletes.state";
import { translateAthletes } from "./athletes.translate";

const Athletes = module("staminity.athletes", ["ngMaterial", "staminity.share"])
    .service("AthletesService", AthletesService)
    .component("athletes", AthletesComponent)
    .component("athleteInvitation", AthleteInvitationComponent)
    .config(["$stateProvider", ($stateProvider: StateProvider) => {
        athletesStates.forEach($stateProvider.state);
    }])
    .config(["$translateProvider", ($translate) => {
        supportLng.forEach((lng) => {
            $translate.translations(lng, { "athletes": translateAthletes[lng] });
            $translate.translations(lng, { "athlete-invitation": translateAthleteInvitation[lng] });
        });
    }])
    .name;

export default Athletes;
