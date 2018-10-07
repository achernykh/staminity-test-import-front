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
            img: 'https://264710.selcdn.ru/assets/images/_premium/premiumPlanning.png',
            functions: ['calendarItemFuturePlanning']
        },
        {
            code: 'activityDetails',
            img: 'https://264710.selcdn.ru/assets/images/_premium/premiumDetailedAnalysis.png',
            functions: ['activityDetails']
        },
        {
            code: 'proAnalytics',
            img: 'https://264710.selcdn.ru/assets/images/_premium/premiumAnalytics.png',
            functions: ['pmc', 'activityMeasures', 'timeInZonesHR', 'timeInZonesPower', 'timeInZonesSpeed', 'HRTimePeaks', 'SpeedTimePeaks', 'PowerTimePeaks', 'completePercent']
        },
        {
            code: 'seasonPlanning',
            img: 'https://264710.selcdn.ru/assets/images/_premium/premiumSeasonPlanning.png',
            functions: ['seasonPlanning', 'periodization']
        },
        {
            code: 'categories',
            img: 'https://264710.selcdn.ru/assets/images/_premium/premiumCategories.png',
            functions: ['categories']
        },
        {
            code: 'templates',
            img: 'https://264710.selcdn.ru/assets/images/_premium/premiumTemplates.png',
            functions: ['templates']
        }
    ]
};