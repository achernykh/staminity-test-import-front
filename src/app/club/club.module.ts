import { module } from "angular";
import ClubComponent from "./club.component.js";
import configure from "./club.config";

const Club = module("staminity.club", ["ngMaterial", "staminity.share"])
    .component("club", ClubComponent)
    .config(configure)
    .name;

export default Club;