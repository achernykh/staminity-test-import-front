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
            code: 'featurePlaning',
            img: ''
        },
        {
            code: 'proAnalytics',
            img: ''
        },
        {
            code: 'seasonPlaning',
            img: ''
        }
    ]
}