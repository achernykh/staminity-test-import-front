export const deepCopy = (data: any): any => {
    return JSON.parse(JSON.stringify(data));
};