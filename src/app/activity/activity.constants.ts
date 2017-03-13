import {IActivityType, IActivityCategory} from "../../../api/activity/activity.interface";

export const activityTypes: Array<IActivityType> = [
    {id: 2, code: "run", typeBasic: "run", enabled: true},
    {id: 3, code: "streetRun", typeBasic: "run", enabled: true},
    {id: 4, code: "indoorRun", typeBasic: "run", enabled: true},
    {id: 5, code: "trailRun", typeBasic: "run", enabled: true},
    {id: 6, code: "treadmillRun", typeBasic: "run", enabled: true},
    {id: 7, code: "swim", typeBasic: "swim", enabled: true},
    {id: 8, code: "openWaterSwim", typeBasic: "swim", enabled: true},
    {id: 9, code: "poolSwim", typeBasic: "swim", enabled: true},
    {id: 10, code: "bike", typeBasic: "bike", enabled: true},
    {id: 11, code: "trackBike", typeBasic: "bike", enabled: true},
    {id: 12, code: "indoorBike", typeBasic: "bike", enabled: true},
    {id: 13, code: "strength", typeBasic: "strength", enabled: true},
    {id: 14, code: "transition", typeBasic: "transition", enabled: false},
    {id: 15, code: "swimToBike", typeBasic: "transition", enabled: false},
    {id: 16, code: "bikeToRun", typeBasic: "transition", enabled: false},
    {id: 17, code: "swimToRun", typeBasic: "transition", enabled: false},
    {id: 18, code: "ski", typeBasic: "ski", enabled: true},
    {id: 1, code: "other", typeBasic: "other", enabled: true}
];

export const getType = (id: number):IActivityType => activityTypes.filter(type => type.id === id)[0];

//export const getCategory(id: number):IActivityCategory => this.category.filter(type => type.id === id)[0];

