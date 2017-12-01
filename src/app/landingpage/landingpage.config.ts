import {StateDeclaration, StateProvider} from "angular-ui-router";
import {DefaultTemplate, DisplayView} from "../core/display.constants";
import { SocketService } from "../core/socket/socket.service";
import {_translate} from "./landingpage.translate";
//import {ITranslateProvider} from "angular-translate";

function configure($stateProvider:StateProvider,
                   $translateProvider:any) {

	$stateProvider
		.state("welcome", <StateDeclaration>{
			url: "/",
			loginRequired: false,
			authRequired: null,
			resolve: {
				view: () => new DisplayView("landingPage"),
			},
			views: DefaultTemplate("landingPage"),
		})
		.state("tariffs", <StateDeclaration>{
			url: "/tariffs",
			loginRequired: false,
			authRequired: null,
			resolve: {
				view: () => new DisplayView("landingTariffs"),
			},
			views: DefaultTemplate("landingTariffs"),
		});

	// Текст представлений
	$translateProvider.translations("en", {landing: _translate["en"]});
	$translateProvider.translations("ru", {landing: _translate["ru"]});


}

configure.$inject = ["$stateProvider", "$translateProvider"];

export default configure;