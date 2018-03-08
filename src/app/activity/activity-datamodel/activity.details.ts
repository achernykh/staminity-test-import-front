import {copy} from "angular";
import {
    IActivityDetails, IActivityDetailsMeasure, IActivityDetailsSocial,
    ICalcMeasures,
} from "../../../../api/activity/activity.interface";
import {getSportLimit, Measure} from "../../share/measure/measure.constants";

export interface IRoute {
    lat: number;
    lng: number;
}

export interface IChartMeasureData {
    measures: {}; // Перечень показателей, которые будут показаны на графике
    data: Array<{}>; // Массив данных для показа на графике
    max: any;
    measuresX: string[];
    measuresY: string[];
}

export class ActivityDetails implements IActivityDetails {
    activityId: number;
    revision: number; // поле полностью соответствует calendarItem.revision
    // показатели, по которым имеются метрики в разрезе каждой временной отсечки на часах
    social: IActivityDetailsSocial;
    // значения показателей. Порядок значений соответствует порядку idx ключей объекта $.measures.<measureCode>.idx
    measures: IActivityDetailsMeasure;
    metrics: number[][] = [];

    isEmpty: boolean = true;
    isRouteExist: boolean = false;

    private _route: IRoute[] = [];

    constructor(params?: any) {
        Object.assign(this, params || {});
        this._route = this.calculateRoute();
        this.isEmpty = this.metrics.length === 0;
        this.isRouteExist = this._route.length > 0;
    }

    get route(): IRoute[] {
        return this._route;
    }

    chartData(sportBasic: string, calcMeasure: ICalcMeasures): IChartMeasureData {
        const measures: {} = {}; // Перечень показателей, которые будут показаны на графике
        const data: Array<{}> = []; // Массив данных для показа на графике
        const maxValue: {} = {}; // Максимальные/минимальные значения для таблицы показателей...

        const measuresX: string[] = ["distance", "elapsedDuration"];
        const measuresY: string[] = ["heartRate", "speed", "power", "cadence", "strokes", "altitude"];
        const measuresSecondary: string[] = ["timestamp", "duration"];

        let array: string[];

        // 1) Расчет показателей интенсиновсти - Y шкала
        array = copy(measuresY);
        array.forEach((key) => {
            if (this.measures.hasOwnProperty(key) &&
                (calcMeasure.hasOwnProperty(key) && calcMeasure[key].value > 0)) {
                measures[key] = this.measures[key];
                measures[key].show = true;
                if (calcMeasure[key] && calcMeasure[key].hasOwnProperty("minValue")) {
                    maxValue[key] = {
                        max: calcMeasure[key].maxValue,
                        min: calcMeasure[key].minValue,
                    };
                }
            } else if (this.measures.hasOwnProperty(key) && key === 'strokes') {
                measures[key] = this.measures[key];
                measures[key].show = true;
            }
            else {
                measuresY.splice(measuresY.indexOf(key), 1);
            }
        });

        // 2) Расчет показателей длительности - X шкала
        array = copy(measuresX);
        array.forEach((key) => {
            if (this.measures.hasOwnProperty(key) &&
                (!calcMeasure.hasOwnProperty(key) || (calcMeasure.hasOwnProperty(key) && calcMeasure[key].value > 0))) {
                measures[key] = this.measures[key];
                measures[key].show = true;
            } else {
                measuresX.splice(measuresX.indexOf(key), 1);
            }
        });

        // 3) Дополнительные показатели
        measuresSecondary.forEach((key) => {
            measures[key] = this.measures[key];
            measures[key].show = true;
        });

        // 4) Подготовка детальных данных для графика
        this.metrics.forEach((info) => {
            const cleaned = {};
            for (const key in measures) {
                const measure: Measure = new Measure(key, sportBasic);
                cleaned[key] = measure.isPace() ?
                    Math.max(info[measures[key].idx], getSportLimit(sportBasic, key).min) :
                    info[measures[key].idx];
            }
            data.push(cleaned);
        });

        return {
            measures,
            data,
            max: maxValue,
            measuresX,
            measuresY,
        };
    }

    /**
     * @description Маршрут в формате постронения карты leaflet
     * @returns {{lng: number, lat: number, timestamp: number}[]}
     */
    private calculateRoute(): IRoute[] {
        if (!this.measures || (
            this.measures &&
            !this.measures.hasOwnProperty("longitude") &&
            !this.measures.hasOwnProperty("latitude"))) {
            return [];
        }
        const lng = this.measures["longitude"].idx; // lng index in array
        const lat = this.measures["latitude"].idx; // lat index in array
        const timestamp = this.measures["timestamp"].idx; // timestamp index in array

        return this.metrics
            .filter((m) => m[lng] > 0 || m[lat] > 0)
            .map((m) => ({lng: m[lng], lat: m[lat], timestamp: m[timestamp]}));
    }

}
