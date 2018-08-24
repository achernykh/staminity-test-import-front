export interface AnalyticsConfig {
    dir: string;
    charts: string[];
}

export const analyticsConfig: AnalyticsConfig = {
    dir: './chart-templates',
    charts: ['pmc', 'distanceByAthletesByPeriods', 'actualMovingDuration', 'actualDistance'],
};