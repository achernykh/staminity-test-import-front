export interface PremiumPageConfig {
    code: string;
    img: string;
    functions: string[];
}
export interface PremiumConfig {
    pages: PremiumPageConfig[];
}
export const premiumConfig: PremiumConfig = {
    pages: [
        {
            code: 'futurePlanning',
            img: '',
            functions: ['calendarItemFuturePlanning']
        },
        {
            code: 'activityDetails',
            img: '',
            functions: ['activityDetails']
        },
        {
            code: 'proAnalytics',
            img: '',
            functions: ['pmc', 'activityMeasures', 'timeInZonesHR', 'timeInZonesPower', 'timeInZonesSpeed', 'HRTimePeaks', 'SpeedTimePeaks', 'PowerTimePeaks', 'completePercent']
        },
        {
            code: 'seasonPlanning',
            img: '',
            functions: ['seasonPlanning', 'periodization']
        },
        {
            code: 'categories',
            img: '',
            functions: ['categories']
        },
        {
            code: 'templates',
            img: '',
            functions: ['templates']
        }
    ]
};