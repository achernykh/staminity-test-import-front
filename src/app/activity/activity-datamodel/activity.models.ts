import { IActivityMeasure, ICalcMeasures, IDurationMeasure, IIntensityMeasure} from "../../../../api/activity/activity.interface";
/**
 * Генерируем пустую структуру IActivityMeasure
 * @param code
 */
export class ActivityMeasure implements IActivityMeasure{

    value: number =null;
    minValue: number = null;
    maxValue: number = null;
    avgValue: number = null;

    constructor(public code: string) {

    }
}

export class ActivityIntervalCalcMeasure implements ICalcMeasures{

    params: Array<string> = [
        'heartRate', 'heartRateDistancePeaks', 'speed', 'speedDistancePeaks', 'duration', 'movingDuration',
        'distance', 'cadence', 'strideLength', 'swolf', 'calories', 'power', 'powerDistancePeaks', 'adjustedPower',
        'altitude', 'elevationGain', 'elevationLoss', 'grade', 'vam', 'vamPowerKg', 'temperature', 'intensityLevel',
        'variabilityIndex', 'efficiencyFactor', 'decouplingPower', 'decouplingPace', 'trainingLoad', 'completePercent'];

    constructor() {
        this.params.map(p => Object.assign(this, { [p]: new ActivityMeasure(p)}));
        //Object.assign(this,...this.params.map(p => new ActivityMeasure(p)));
    }
}

export class DurationMeasure implements IDurationMeasure{
    durationValue: number = null;
}

export class IntensityMeasure implements IIntensityMeasure{
    intensityLevelFrom: number = null;
    intensityLevelTo: number = null;
    intensityByFtpFrom: number = null;
    intensityByFtpTo: number = null;
}