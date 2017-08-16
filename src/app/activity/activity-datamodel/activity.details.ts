import {
    IActivityDetails, IActivityDetailsSocial, IActivityDetailsMeasure,
    ICalcMeasures
} from "../../../../api/activity/activity.interface";
import {copy} from 'angular';
import {Measure, getSportLimit} from "../../share/measure/measure.constants";

export interface IRoute {
    lat:number;
    lng: number;
}

export interface IChartMeasureData {
    measures: {}; // Перечень показателей, которые будут показаны на графике
    data: Array<{}>; // Массив данных для показа на графике
    max: any;
    measuresX: Array<string>;
    measuresY: Array<string>;
}

export class ActivityDetails implements IActivityDetails {
    activityId: number;
    revision: number; // поле полностью соответствует calendarItem.revision
    // показатели, по которым имеются метрики в разрезе каждой временной отсечки на часах
    social: IActivityDetailsSocial;
    // значения показателей. Порядок значений соответствует порядку idx ключей объекта $.measures.<measureCode>.idx
    measures: IActivityDetailsMeasure;
    metrics: Array<Array<number>>;

    public isEmpty: boolean = true;
    private _route: Array<IRoute> = [];

    constructor(params?: any){
        Object.assign(this, params || {});
        this._route = this.calculateRoute();
        this.isEmpty = this._route.length === 0;
    }

    isRouteExist():boolean {
        return this._route.length > 0;
    }

    get route():Array<IRoute> {
        return this._route;
    }

    chartData(sportBasic: string, calcMeasure: ICalcMeasures):IChartMeasureData{
        let measures: {} = {}; // Перечень показателей, которые будут показаны на графике
        let data: Array<{}> = []; // Массив данных для показа на графике
        let maxValue: {} = {}; // Максимальные/минимальные значения для таблицы показателей...

        let measuresX: Array<string> = ['distance', 'elapsedDuration'];
        let measuresY: Array<string> = ['heartRate', 'speed', 'power','altitude'];
        let measuresSecondary: Array<string> = ['timestamp','duration'];

        let array: Array<string>;

        // 1) Расчет показателей интенсиновсти - Y шкала
        array = copy(measuresY);
        array.forEach(key => {
            if (this.measures.hasOwnProperty(key) &&
                (calcMeasure.hasOwnProperty(key) && calcMeasure[key].value > 0)) {
                measures[key] = this.measures[key];
                measures[key]['show'] = true;
                if(calcMeasure[key] && calcMeasure[key].hasOwnProperty('minValue')) {
                    maxValue[key] = {
                        max: calcMeasure[key].maxValue,
                        min: calcMeasure[key].minValue
                    };
                }
            } else {
                measuresY.splice(measuresY.indexOf(key), 1);
            }
        });

        // 2) Расчет показателей длительности - X шкала
        array = copy(measuresX);
        array.forEach(key => {
            if (this.measures.hasOwnProperty(key) &&
                (!calcMeasure.hasOwnProperty(key) || (calcMeasure.hasOwnProperty(key) && calcMeasure[key].value > 0))) {
                measures[key] = this.measures[key];
                measures[key]['show'] = true;
            } else {
                measuresX.splice(measuresX.indexOf(key), 1);
            }
        });

        // 3) Дополнительные показатели
        measuresSecondary.forEach(key => {
            measures[key] = this.measures[key];
            measures[key]['show'] = true;
        });

        // 4) Подготовка детальных данных для графика
        this.metrics.forEach(info => {
            let cleaned = {};
            for (let key in measures) {
                let measure: Measure = new Measure(key,sportBasic);
                cleaned[key] = measure.isPace() ?
                    Math.max(info[measures[key]['idx']], getSportLimit(sportBasic,key)['min']) :
                    info[measures[key]['idx']];
            }
            data.push(cleaned);
        });

        return {
            measures: measures,
            data: data,
            max: maxValue,
            measuresX: measuresX,
            measuresY: measuresY
        };
    }

    /**
     * @description Маршрут в формате постронения карты leaflet
     * @returns {{lng: number, lat: number, timestamp: number}[]}
     */
    private calculateRoute():Array<IRoute> {
        if(!this.measures){
            return [];
        }
        let lng = this.measures['longitude'].idx; // lng index in array
        let lat = this.measures['latitude'].idx; // lat index in array
        let timestamp = this.measures['timestamp'].idx; // timestamp index in array

        return this.metrics
            .filter(m => m[lng] > 0 || m[lat] > 0)
            .map(m => ({lng: m[lng],lat: m[lat], timestamp: m[timestamp]}));
    }

}