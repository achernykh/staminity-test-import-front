import { ISocketService } from './socket.service';
import { ISessionService } from './session.service';
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { 
	GetActivityCategory, PostActivityCategory, PutActivityCategory, DeleteActivityCategory,
	GetActivityTemplate, PostActivityTemplate, PutActivityTemplate, DeleteActivityTemplate
} from "../../../api/reference/reference.request";

import { maybe, prop } from "../share/util.js";


const systemUserId = 1;

export default class ReferenceService {

	static $inject = ['SocketService', 'SessionService'];

	constructor (
		private SocketService:ISocketService, 
		private SessionService: ISessionService
	) {

	}

	getActivityCategories (
		activityTypeId: number, 
		onlyMine: boolean, 
		showInvisible: boolean
	) : Promise<[IActivityCategory]> {
		return this.SocketService.send(new GetActivityCategory(
			activityTypeId, onlyMine, showInvisible
		));
	}

	postActivityCategory (
		activityTypeId: number, 
		code: string, 
		description: string, 
		groupId: number
	) : Promise<any> {
		return this.SocketService.send(new PostActivityCategory(
			activityTypeId, code, description, groupId
		));
	}

	putActivityCategory (
		activityCategoryId: number, 
		code: string, 
		description: string, 
		groupId: number, 
		sortOrder: number, 
		visible: boolean
	) : Promise<any> {
		return this.SocketService.send(new PutActivityCategory(
			activityCategoryId, code, description, groupId, sortOrder, visible
		));
	}

	deleteActivityCategory (activityCategoryId: number) : Promise<any> {
		return this.SocketService.send(new DeleteActivityCategory(activityCategoryId));
	}

	getActivityTemplates (
		activityCategoryId: number, 
		activityTypeId: number,
		onlyVisible: boolean,
		onlyFavourites: boolean
	) : Promise<[IActivityTemplate]> {
		return this.SocketService.send(new GetActivityTemplate(
			activityCategoryId, activityTypeId, onlyVisible, onlyFavourites
		))
		.then((response) => response.arrayResult);
	}

	postActivityTemplate (
		id: number,
		activityCategoryId: number,
		groupId: number,
		code: string,
		description: string,
		favourite: boolean,
		content: boolean
	) : Promise<[IActivityCategory]> {
		return this.SocketService.send(new PostActivityTemplate(
			id, activityCategoryId, groupId, code, description, favourite, content
		));
	}

	putActivityTemplate (
		id: number,
		activityCategoryId: number,
		groupId: number,
		sortOrder: number,
		code: string,
		description: string,
		favourite: boolean,
		visible: boolean
	) : Promise<[IActivityCategory]> {
		return this.SocketService.send(new PutActivityTemplate(
			id, activityCategoryId, groupId, sortOrder, code, description, favourite, visible
		));
	}

	deleteActivityTemplate (id: number) : Promise<[IActivityCategory]> {
		return this.SocketService.send(new DeleteActivityTemplate(id));
	}

	get cathegoryOwner () {
		let user = this.SessionService.getUser();
		return (cathegory) => {
			let userId = cathegory.userProfileCreator && cathegory.userProfileCreator.userId;
			return (userId === user.userId && 'user')
				|| (userId === systemUserId && 'system')
				|| (cathegory.groupProfile && 'club')
				|| 'coach';
		};
	}

	get templateOwner () {
		let user = this.SessionService.getUser();
		return (template) => {
			let userId = template.userProfileCreator && template.userProfileCreator.userId;
			return (userId === user.userId && 'user')
				|| (userId === systemUserId && 'system')
				|| (template.groupProfile && 'club')
				|| 'coach';
		};
	}

	createMeasure (code) {
		return { code };
	}

	createInterval (type) {
		return {
			"type": type,
			"power": {
				"order": 230,
				"sourceMeasure":"power",
				"intensityByFtpTo":null,
				"intensityLevelTo":null,
				"intensityByFtpFrom":null,
				"intensityLevelFrom":null
			},
			"speed": {
				"order": 220,
				"sourceMeasure":"speed",
				"intensityByFtpTo":null,
				"intensityLevelTo":null,
				"intensityByFtpFrom":null,
				"intensityLevelFrom":null
			},
			"distance": {
				"order":120,
				"sourceMeasure":"distance",
				"durationValue":null
			},
			"heartRate": {
				"order":210,
				"sourceMeasure":"heartRate",
				"intensityByFtpTo":null,
				"intensityLevelTo":null,
				"intensityByFtpFrom":null,
				"intensityLevelFrom":null
			},
			"movingDuration":{
				"order":110,
				"sourceMeasure":"movingDuration",
				"durationValue":null
			},
			"calcMeasures":{
				"vam":{"code":"vam"},
				"grade":{"code":"grade"},
				"power":{"code":"power"},
				"speed":{"code":"speed"},
				"swolf":{"code":"swolf"},
				"cadence":{"code":"cadence"},
				"altitude":{"code":"altitude"},
				"calories":{"code":"calories"},
				"distance":{"code":"distance"},
				"duration":{"code":"duration"},
				"heartRate":{"code":"heartRate"},
				"vamPowerKg":{"code":"vamPowerKg"},
				"temperature":{"code":"temperature"},
				"strideLength":{"code":"strideLength"},
				"trainingLoad":{"code":"trainingLoad"},
				"adjustedPower":{"code":"adjustedPower"},
				"elevationGain":{"code":"elevationGain"},
				"elevationLoss":{"code":"elevationLoss"},
				"decouplingPace":{"code":"decouplingPace"},
				"intensityLevel":{"code":"intensityLevel"},
				"movingDuration":{"code":"movingDuration"},
				"completePercent":{"code":"completePercent"},
				"decouplingPower":{"code":"decouplingPower"},
				"efficiencyFactor":{"code":"efficiencyFactor"},
				"variabilityIndex":{"code":"variabilityIndex"},
				"powerDistancePeaks":{"code":"powerDistancePeaks"},
				"speedDistancePeaks":{"code":"speedDistancePeaks"},
				"heartRateDistancePeaks":{"code":"heartRateDistancePeaks"}
			},
			"durationValue":null,
			"durationMeasure":"distance",
			"intensityByFtpTo":null,
			"intensityLevelTo":null,
			"intensityMeasure":"heartRate",
			"intensityByFtpFrom":null,
			"intensityLevelFrom":null,
			"trainersPrescription":""
		};
	}
}
