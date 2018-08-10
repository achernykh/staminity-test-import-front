export interface PremiumPageConfig {
    code: string;
    img: string;
    functions: string[];
}
export interface PremiumConfig {
    pages: PremiumPageConfig[]
}
export const premiumConfig: PremiumConfig = {
    pages: [
        {
            code: 'futurePlanning',
            img: '',
            functions: []
        },
        {
            code: 'activityDetails',
            img: '',
            functions: []
        },
        {
            code: 'proAnalytics',
            img: '',
            functions: ['pmc']
        },
        {
            code: 'seasonPlanning',
            img: '',
            functions: []
        },
        {
            code: 'categories',
            img: '',
            functions: []
        },
        {
            code: 'templates',
            img: '',
            functions: []
        }
    ]
}