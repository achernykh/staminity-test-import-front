import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { IActivityIntervalPW } from "../../../api/activity/activity.interface";
import { IUserProfile } from "../../../api/user/user.interface";


const systemUserId = 1;

export const cathegoryOwner = (user: IUserProfile) => (cathegory: IActivityCategory) => {
	let userId = cathegory.userProfileCreator && cathegory.userProfileCreator.userId;
	return (userId === user.userId && 'user')
		|| (userId === systemUserId && 'system')
		|| (cathegory.groupProfile && 'club')
		|| 'coach';
};

export const templateOwner = (user: IUserProfile) => (template: IActivityTemplate) => {
	let userId = template.userProfileCreator && template.userProfileCreator.userId;
	return (userId === user.userId && 'user')
		|| (userId === systemUserId && 'system')
		|| (template.groupProfile && 'club')
		|| 'coach';
};

const createIntervalPW = () : IActivityIntervalPW => <any>({
	"type": 'pW',
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
	"trainersPrescription":"",
	"movingDurationApprox":null,
	"distanceApprox":null,
	"keyInterval":null,
	"intensityDistribution":null,
	"intensityFtpMax":null,
	"movingDurationLength":null,
	"distanceLength":null,
	"actualDurationValue":null
});

export const createTemplate = (cathegory: IActivityCategory) : IActivityTemplate => ({
	id: null,
	revision: null,
	code: '',
	description: '',
	activityCategory: cathegory,
	userProfileCreator: null,
	groupProfile: null,
	sortOrder: 99999,
	visible: true,
	favourite: false,
	content: [createIntervalPW()]
});