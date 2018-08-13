export interface JsonLdParams {
    lng: string;
    locale: string;
    language: string;
    availableLanguage: string;
    // page
    title: string;
    subtitle: string;
    urlLockRu: string;
    urlLockEn: string;
    imageUrl: string;
    // global
    url: string;
    name: string;
    description: string;
    about: string;
    image: string;
};

export const dbSessionKey: string = 'session';
export const dbDataKey: string = 'version';
export const dbDataVersion: number = 1;

export const getMainJsonLd = (params: JsonLdParams) => ({
    "inLanguage": `${params.language}`,
});

export const getPageJsonLd = (params: JsonLdParams) => ({
    "inLanguage": `${params.language}`,
    "@context" : "http://schema.org",
    "@type" : "Organization",
    "url" : "https://staminity.com",
    "name" : "Staminity",
    "description": "An application for online work with a coach, independent training in cyclic sports and a training diary",
    "logo": "https://264710.selcdn.ru/assets/images/logo/staminity-logo-1024.png",
    "areaServed" : "Worldwide",
    "email" : "support@staminity.com",
    "brand" : [{
        "name" : "Staminity",
        "description": "An application for online work with a coach, independent training in cyclic sports and a training diary"
    }],

    "sameAs": [
        "https://www.facebook.com/staminity",
        "https://instagram.com/staminity_app",
        "https://vk.com/staminity"
    ],
    "contactPoint" : [
        {
            "@type" : "ContactPoint",
            "contactType" : "Customer service",
            "availableLanguage" : ["English","Russian"],
            "url": "https://support.staminity.com",
            "email": "support@staminity.com"
        },
        {
            "@type" : "ContactPoint",
            "contactType" : "Technical support",
            "availableLanguage" : ["English","Russian"],
            "url": "https://support.staminity.com",
            "email": "support@staminity.com"
        }]


});