export interface AnalyticsConfig {
    dir: string;
    groupCharts: string[];
    charts: string[];
}

export const analyticsConfig: AnalyticsConfig = {
    dir: './chart-templates',
    groupCharts: ['athletes', 'measures', 'volumes', 'zonesAndPeaks', 'measurement'],
    charts: [
        'pmc', 'distanceByActivityTypes',
        'distanceByAthletesByPeriods', 'trainingVolumesByAthletes',
        'actualMovingDuration', 'actualDistance','distanceByActivityTypeByPeriods',
        'activityMeasuresSelected', 'activityMeasuresTL',
        'timeInZonesHR', 'timeInZonesSpeed', 'timeInZonesPower',
        'hrTimePeaks', 'paceTimePeaks', 'powerTimePeaks',
        'measurementsByPeriods', 'weightAndTotalVolume', 'completePercent'
    ],
};