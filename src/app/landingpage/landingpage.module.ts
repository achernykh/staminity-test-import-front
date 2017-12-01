import { module } from "angular";
import LandingTariffsComponent from "./landing-tariffs/landing-tariffs.component";
import LandingPageComponent from "./landing/landingpage.component";
import configure from "./landingpage.config";

const Landing = module("staminity.landing", [])
    .component("landingPage", LandingPageComponent)
    .component("landingTariffs", LandingTariffsComponent)
    .config(configure)
    .name;

export default Landing;