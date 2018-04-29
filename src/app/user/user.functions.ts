// import
import * as _connection from "../core/env.js";
import { fullImageUrl } from "../share/image/image.functions";
import { IUserProfile, IUserProfileShort } from "../../../api/user/user.interface";

export const userBackground = () =>
    (url:string) =>
        url && url !== 'default.jpg' ?
            _connection.content + '/content/user/background/' + url :
            '/assets/picture/default_background.jpg';

export const userAvatar = () =>
    (user) =>
        `url(${user && user.public && user.public.hasOwnProperty('avatar') && user.public.avatar !== 'default.jpg' ? 
            fullImageUrl() ('/user/avatar/',user.public.avatar) : 
            '/assets/picture/default_avatar.png'})`;

export function ageByBirthday(birthday): number {
    return new Date(Date.now() - new Date(birthday).getTime()).getFullYear() - 1970;
}

export const userAgeGroup = () => (profile): string => {
    if (!profile) {return "";}
    const sex = profile.sex || "";
    const age = profile.birthday && ageByBirthday(profile.birthday);
    let ageGroup = "";
    if (age < 18) {ageGroup = "00-17";}
    else if (age < 25) {ageGroup = "18-24";}
    else if (age < 30) {ageGroup = "25-29";}
    else if (age < 35) {ageGroup = "30-34";}
    else if (age < 40) {ageGroup = "35-39";}
    else if (age < 45) {ageGroup = "40-44";}
    else if (age < 50) {ageGroup = "45-49";}
    else if (age < 55) {ageGroup = "50-54";}
    else if (age < 60) {ageGroup = "55-59";}
    else if (age < 65) {ageGroup = "60-64";}
    else if (age < 70) {ageGroup = "65-69";}
    else if (age < 75) {ageGroup = "70-74";}
    else if (age < 80) {ageGroup = "75-79";}
    else if (age > 80) {ageGroup = "80+";}
    return sex + ageGroup;
};

export const userIsPremium = () =>
    (userProfile) =>
    userProfile && userProfile.billing.find((tariff) => tariff.tariffCode === "Premium");



/**
 * Функция для фильтра вывода имени пользователя
 * short: Только имя
 * compact: Имя и первую букву Фамилии
 * full: Имя и Фамилию
 */
export const userName = () => (profile: IUserProfile | IUserProfileShort, options: 'short' | 'compact' | 'compact-first' | 'full-last' | 'full'): string => {
    if (
        !profile ||
        !profile.hasOwnProperty('public') ||
        !profile.public.hasOwnProperty('firstName') ||
        !profile.public.hasOwnProperty('lastName')
    ) {return null;}

    switch (options) {
        case 'short': {
            return profile.public.firstName;
        }
        case 'compact': {
            return `${profile.public.firstName} ${profile.public.lastName[0]}.`;
        }
        case 'compact-first': {
            return `${profile.public.lastName} ${profile.public.firstName[0]}.`;
        }
        case 'full-last': {
            return `${profile.public.lastName} ${profile.public.firstName}`;
        }
        default: {
            return `${profile.public.firstName} ${profile.public.lastName}`;
        }
    }
};
