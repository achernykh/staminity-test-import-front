import {ITrainingZones} from "../../../../api/user/user.interface";
import {ActivityIntervalG} from "./activity.interval-g";
import {ActivityIntervalL} from "./activity.interval-l";
import {ActivityIntervalP} from "./activity.interval-p";
import {ActivityIntervalPW} from "./activity.interval-pw";
import {ActivityIntervalU} from "./activity.interval-u";
import {ActivityIntervalW} from "./activity.interval-w";

/**
 * Фабрика создания интеравала тренировки
 * Парметры для создания:
 * 1) тип интервала
 * 2) парамтеры инетрвала
 */
export function ActivityIntervalFactory(type: string, params?: any) {
    switch (type) {
        case "G": {
            return new ActivityIntervalG(type, params);
        }
        case "P": {
            return new ActivityIntervalP(type, params);
        }
        case "L": {
            return new ActivityIntervalL(type, params);
        }
        case "pW": {
            return new ActivityIntervalPW(type, params);
        }
        case "W": {
            return new ActivityIntervalW(type, params);
        }
        case "U": {
            return new ActivityIntervalU(type, params);
        }
    }
}
