export interface PremiumPageConfig {
    code: string;
    img: string;
}
export interface PremiumConfig {
    pages: PremiumPageConfig[]
}
export const premiumConfig: PremiumConfig = {
    pages: [
        {
            code: 'futurePlanning',
            img: '',
            functions: ["",""]
        },
        {
            code: 'activityDetails',
            img: '',
            functions: ["",""]
        },
        {
            code: 'proAnalytics',
            img: '',
            functions: ["",""]
        },
        {
            code: 'seasonPlanning',
            img: '',
            functions: ["",""]
        },
        {
            code: 'categories',
            img: '',
            functions: ["",""]
        },
        {
            code: 'templates',
            img: '',
            functions: ["",""]
        }
    ]
}