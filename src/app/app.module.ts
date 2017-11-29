import {bootstrap, module} from "angular";
import "angular-drag-and-drop-lists/angular-drag-and-drop-lists.js";
import "angularjs-scroll-glue/src/scrollglue.js";
import "drag-drop-webkit-mobile/ios-drag-drop.js";

import AppComponent from "./app.component";
import configure from "./app.config";
import run from "./app.run";

import { ActivityModule } from "./activity";
import Analytics from "./analytics/analytics.module";
import Athletes from "./athletes/athletes.module";
import Auth from "./auth/auth.module";
import CalendarItemMeasurement from "./calendar-item/calendar-item.module";
import Calendar from "./calendar/calendar.module";
import Club from "./club/club.module";
import Core from "./core/core.module";
import Dashboard from "./dashboard/dashboard.module";
import Landing from "./landingpage/landingpage.module";
import Management from "./management/managment.module";
import { Methodology } from "./methodology/methodology.module";
import Profile from "./profile-user/profile-user.module";
import Reference from "./reference/reference.module";
import Search from "./search/search.module";
import SettingsClub from "./settings-club/settings-club.module";
import SettingsUser from "./settings-user/settings-user.module";
import Share from "./share/share.module";
import { TrainingPlans } from "./training-plans/training-plans.module";

const root = module("staminity.application", [
	"pascalprecht.translate", // translate
	"ngMaterial",
	"ngMessages",
	"ngAnimate",
	"ngAria",
	"ngSanitize",
	"ui.router",
	"md.data.table",
	"nemLogging",
	"ui-leaflet",
	"hm.readmore",
	"tmh.dynamicLocale",
	"toaster",
	//'ngTouch',
	"angular-carousel",
	"dndLists",
	"luegg.directives",
	"ngQuill", // https://github.com/KillerCodeMonkey/ng-quill

	Core,
	Share,
	Auth,
	Landing,
	SettingsUser,
	Calendar,
	CalendarItemMeasurement,
	ActivityModule,
	Profile,
	SettingsClub,
	Management,
	Athletes,
	Club,
	Dashboard,
	Search,
	Reference,
	Analytics,
	TrainingPlans,
	Methodology,
])
	.component("staminityApplication", AppComponent)
	.config(configure)
	.run(run)
	.name;

bootstrap(document, ["staminity.application"], {
	strictDi: true,
});

export default root;