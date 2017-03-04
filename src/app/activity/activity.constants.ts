import {IActivityType, IActivityCategory} from "../../../api/activity/activity.interface";

export const activityTypes: Array<IActivityType> = [
    {id: 1, code: "other", typeBasic: "other"},
    {id: 2, code: "run", typeBasic: "run"},
    {id: 3, code: "streetRun", typeBasic: "run"},
    {id: 4, code: "indoorRun", typeBasic: "run"},
    {id: 5, code: "trailRun", typeBasic: "run"},
    {id: 6, code: "treadmillRun", typeBasic: "run"},
    {id: 7, code: "swim", typeBasic: "swim"},
    {id: 8, code: "openWaterSwim", typeBasic: "swim"},
    {id: 9, code: "poolSwim", typeBasic: "swim"},
    {id: 10, code: "bike", typeBasic: "bike"},
    {id: 11, code: "trackBike", typeBasic: "bike"},
    {id: 12, code: "indoorBike", typeBasic: "bike"},
    {id: 13, code: "strength", typeBasic: "strength"},
    {id: 14, code: "transition", typeBasic: "transition"},
    {id: 15, code: "swimToBike", typeBasic: "transition"},
    {id: 16, code: "bikeToRun", typeBasic: "transition"},
    {id: 17, code: "swimToRun", typeBasic: "transition"},
    {id: 18, code: "ski", typeBasic: "ski"}
];

export const getType = (id: number):IActivityType => activityTypes.filter(type => type.id === id)[0];

//export const getCategory(id: number):IActivityCategory => this.category.filter(type => type.id === id)[0];

