"use strict";
exports.ACTIVITY_TYPE = [
    {
        "id": 1, "typeBasic": "default", "code": "default"
    },
    {
        "id": 2,
        "typeBasic": "run",
        "code": "run"
    }, { "id": 3, "typeBasic": "swim", "code": "swim" }, { "id": 4, "typeBasic": "bike", "code": "bike" }, {
        "id": 7,
        "typeBasic": "run",
        "code": "running"
    }, { "id": 9, "typeBasic": "swim", "code": "lap_swimming" }, {
        "id": 10,
        "typeBasic": "bike",
        "code": "cycling"
    }, { "id": 12, "typeBasic": "bike", "code": "Biking" }, { "id": 13, "typeBasic": "bike", "code": "cyclocross" }, {
        "id": 14,
        "typeBasic": "bike",
        "code": "downhill_biking"
    }, { "id": 15, "typeBasic": "bike", "code": "indoor_cycling" }, {
        "id": 16,
        "typeBasic": "bike",
        "code": "mountain_biking"
    }, { "id": 17, "typeBasic": "bike", "code": "recumbent_cycling" }, {
        "id": 18,
        "typeBasic": "bike",
        "code": "road_biking"
    }, { "id": 19, "typeBasic": "bike", "code": "track_cycling" }, {
        "id": 20,
        "typeBasic": "other",
        "code": "fitness_equipment"
    }, { "id": 21, "typeBasic": "other", "code": "elliptical" }, {
        "id": 22,
        "typeBasic": "other",
        "code": "indoor_cardio"
    }, { "id": 23, "typeBasic": "other", "code": "indoor_rowing" }, {
        "id": 24,
        "typeBasic": "other",
        "code": "stair_climbing"
    }, { "id": 25, "typeBasic": "other", "code": "strength_training" }, {
        "id": 26,
        "typeBasic": "bike",
        "code": "bmx"
    }, { "id": 27, "typeBasic": "bike", "code": "gravel_cycling" }, {
        "id": 28,
        "typeBasic": "run",
        "code": "street_running"
    }, { "id": 29, "typeBasic": "run", "code": "track_running" }, {
        "id": 30,
        "typeBasic": "run",
        "code": "trail_running"
    }, { "id": 31, "typeBasic": "run", "code": "treadmill_running" },
    { "id": 32, "typeBasic": "bike", "code": "Biking" },
    { "id": 33, "typeBasic": "swim", "code": "open_water_swimming" }, {
        "id": 34,
        "typeBasic": "other",
        "code": "walking"
    }, { "id": 35, "typeBasic": "other", "code": "hiking" }, {
        "id": 36,
        "typeBasic": "other",
        "code": "casual_walking"
    }, { "id": 37, "typeBasic": "other", "code": "speed_walking" }, {
        "id": 38,
        "typeBasic": "other",
        "code": "transition"
    }, { "id": 39, "typeBasic": "other", "code": "steps" }, {
        "id": 40,
        "typeBasic": "other",
        "code": "swimToBikeTransition"
    }, { "id": 41, "typeBasic": "other", "code": "bikeToRunTransition" }, {
        "id": 42,
        "typeBasic": "other",
        "code": "runToBikeTransition"
    }, { "id": 43, "typeBasic": "other", "code": "backcountry_skiing_snowboarding" }, {
        "id": 44,
        "typeBasic": "other",
        "code": "boating"
    }, { "id": 45, "typeBasic": "other", "code": "inline_skating" }, {
        "id": 46,
        "typeBasic": "other",
        "code": "mountaineering"
    }, { "id": 47, "typeBasic": "other", "code": "paddling" }, { "id": 48, "typeBasic": "other", "code": "rowing" }, {
        "id": 49,
        "typeBasic": "other",
        "code": "sailing"
    }, { "id": 50, "typeBasic": "other", "code": "tennis" }, {
        "id": 51,
        "typeBasic": "other",
        "code": "wingsuit_flying"
    }, { "id": 52, "typeBasic": "skiing", "code": "cross_country_skiing" }, {
        "id": 54,
        "typeBasic": "skiing",
        "code": "resort_skiing_snowboarding"
    }, { "id": 55, "typeBasic": "skiing", "code": "skate_skiing" }, {
        "id": 56,
        "typeBasic": "motorcycling",
        "code": "motorcycling"
    }, { "id": 57, "typeBasic": "motorcycling", "code": "atv" }, {
        "id": 58,
        "typeBasic": "motorcycling",
        "code": "motocross"
    }, { "id": 5, "typeBasic": "other", "code": "other" }];
exports.getActivityType = function (id) { return exports.ACTIVITY_TYPE.filter(function (type) { return type.id === id; })[0]; };
exports.ACTIVITY_CATEGORY = [
    {
        id: 1,
        code: 'Восстановление',
        description: 'Целью восстановления является... Применятся с ...',
        activityTypeId: 2,
        userOwner: null
    },
    {
        id: 2,
        code: 'Короткие интервалы МПК',
        description: 'Целью восстановления кортких интервалов на уровне МПК... Применятся с ...',
        activityTypeId: 2,
        userOwner: null
    }
];
exports.getCategory = function (id) { return exports.ACTIVITY_CATEGORY.filter(function (c) { return c.id === id; })[0]; };
