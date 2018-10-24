export interface AnalyticsConfig {
    dir: string;
    groupCharts: string[][];
    charts: string[];
}

export const analyticsConfig: AnalyticsConfig = {
    dir: './chart-templates',
    groupCharts: [
        ['athletes', 'measurement', 'measures'],
        ['volumes'],
        ['zonesAndPeaks']
    ],
    charts: [
        'pmc', 'distanceByActivityTypes',
        'distanceByAthletesByPeriods', 'trainingVolumesByAthletes',//'durationByAthletesByPeriods',
        'actualMovingDuration', 'actualDistance','distanceByActivityTypeByPeriods',
        'activityMeasuresSelected', 'activityMeasuresTL',
        'timeInZonesHR', 'timeInZonesSpeed', 'timeInZonesPower',
        'hrTimePeaks', 'paceTimePeaks', 'powerTimePeaks',
        'measurementsByPeriods', 'weightAndTotalVolume', 'completePercent'
    ],
};