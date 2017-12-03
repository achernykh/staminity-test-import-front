import { IActivityMeasure, ICalcMeasures, IDurationMeasure, IIntensityMeasure} from "../../../../api/activity/activity.interface";
/**
 * Генерируем пустую структуру IActivityMeasure
 * @param code
 */
export class ActivityMeasure implements IActivityMeasure {

    value: number = null;
    minValue: number = null;
    maxValue: number = null;
    avgValue: number = null;

    constructor(public code: string) {

    }
}

export class ActivityIntervalCalcMeasure implements ICalcMeasures {

    params: string[] = [
        "heartRate", "heartRateDistancePeaks", "speed", "speedDistancePeaks", "duration", "movingDuration",
        "distance", "cadence", "strideLength", "swolf", "calories", "power", "powerDistancePeaks", "adjustedPower",
        "altitude", "elevationGain", "elevationLoss", "grade", "vam", "vamPowerKg", "temperature", "intensityLevel",
        "variabilityIndex", "efficiencyFactor", "decouplingPower", "decouplingPace", "trainingLoad", "completePercent"];

    constructor() {
        this.params.map((p) => Object.assign(this, { [p]: new ActivityMeasure(p)}));
        //Object.assign(this,...this.params.map(p => new ActivityMeasure(p)));
    }
}

export class DurationMeasure implements IDurationMeasure {
    constructor(
        public durationValue: number = null) {}
}

export class IntensityMeasure implements IIntensityMeasure {
    constructor(
        public intensityByFtpFrom: number = null,
        public intensityByFtpTo: number = null,
        public intensityLevelFrom: number = null,
        public intensityLevelTo: number = null,
    ) {}
}
