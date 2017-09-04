import {ActivityIntervalP} from "./activity.interval-p";
import {ActivityIntervalG} from "./activity.interval-g";
import {ActivityIntervalPW} from "./activity.interval-pw";
import {ActivityIntervalW} from "./activity.interval-w";
import {ActivityIntervalL} from "./activity.interval-l";

/**
 * Фабрика создания интеравала тренировки
 * Парметры для создания:
 * 1) тип интервала
 * 2) парамтеры инетрвала
 */
export function ActivityIntervalFactory (type: string, params?: any) {
    switch (type) {
        case 'G': {
            return new ActivityIntervalG(type, params);
        }
        case 'P': {
            return new ActivityIntervalP(type, params);
        }
        case 'L': {
            return new ActivityIntervalL(type, params);
        }
        case 'pW': {
            return new ActivityIntervalPW(type, params);
        }
        case 'W': {
            return new ActivityIntervalW(type, params);
        }
    }
}