export interface AnalyticsConfig {
    dir: string;
    charts: string[];
}

export const analyticsConfig: AnalyticsConfig = {
    dir: './chart-templates',
    charts: [
        'pmc', 'distanceByActivityTypes',
        'distanceByAthletesByPeriods', 'durationByAthletesByPeriods',
        'actualMovingDuration', 'actualDistance','distanceByActivityTypeByPeriods',
        'activityMeasuresSelected', 'activityMeasuresTL',
        'timeInZonesHR', 'timeInZonesSpeed', 'timeInZonesPower',
        'hrTimePeaks', 'paceTimePeaks', 'powerTimePeaks',
        'measurementsByPeriods', 'weightAndTotalVolume', 'completePercent'
    ],
};