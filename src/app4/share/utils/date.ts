export let toDay = (date):Date => {
    let result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
};