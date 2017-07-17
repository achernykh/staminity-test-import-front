import { IActivityType } from "../../../api/activity/activity.interface";


export const activityTypes : Array<IActivityType> = [
	{ id: 2, code: "run", typeBasic: "run", enabled: true, isBasic: true },
	{ id: 3, code: "streetRun", typeBasic: "run", enabled: true, isBasic: false },
	{ id: 4, code: "indoorRun", typeBasic: "run", enabled: true, isBasic: false },
	{ id: 5, code: "trailRun", typeBasic: "run", enabled: true, isBasic: false },
	{ id: 6, code: "treadmillRun", typeBasic: "run", enabled: true, isBasic: false },
	{ id: 7, code: "swim", typeBasic: "swim", enabled: true, isBasic: true },
	{ id: 8, code: "openWaterSwim", typeBasic: "swim", enabled: true, isBasic: false },
	{ id: 9, code: "poolSwim", typeBasic: "swim", enabled: true, isBasic: false },
	{ id: 10, code: "bike", typeBasic: "bike", enabled: true, isBasic: true },
	{ id: 11, code: "trackBike", typeBasic: "bike", enabled: true, isBasic: false },
	{ id: 12, code: "indoorBike", typeBasic: "bike", enabled: true, isBasic: false },
	{ id: 13, code: "strength", typeBasic: "strength", enabled: true, isBasic: true },
	{ id: 14, code: "transition", typeBasic: "transition", enabled: false, isBasic: false },
	{ id: 15, code: "swimToBike", typeBasic: "transition", enabled: false, isBasic: false },
	{ id: 16, code: "bikeToRun", typeBasic: "transition", enabled: false, isBasic: false },
	{ id: 17, code: "swimToRun", typeBasic: "transition", enabled: false, isBasic: false },
	{ id: 18, code: "ski", typeBasic: "ski", enabled: true, isBasic: true },
	{ id: 1, code: "other", typeBasic: "other", enabled: true, isBasic: true }
];

export const measuresByCode : any = {
	swim: ['movingDuration','distance', 'heartRate','speed'],
	bike: ['movingDuration','distance','heartRate', 'speed','power'],
	run: ['movingDuration','distance','heartRate', 'speed'],
	strength: ['movingDuration','distance','heartRate'],
	transition: ['movingDuration','distance','heartRate', 'speed'],
	ski: ['movingDuration','distance','heartRate', 'speed'],
	other: ['movingDuration','distance','heartRate', 'speed'],
	default: ['movingDuration','distance','heartRate', 'speed'],
};

