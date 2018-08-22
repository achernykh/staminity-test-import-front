import {AnalyticsConfig} from "@app/analytics/analytics.constants";
import {IHttpService} from "angular";
import { SocketService } from "../core/socket/socket.service";
import { GetChartSettings, PostChartSettings } from "../../../api/statistics/statistics.request";

export class AnalyticsService {
    static $inject = ['$http', 'analyticsConfig', 'SocketService'];
    constructor (private $http: IHttpService,
                 private config: AnalyticsConfig,
                 private socket: SocketService) {

    }

    getChartSettings (): Promise<any> {
        return this.socket.send(new GetChartSettings()).then(r => r && r.arrayResult || null);
    }

    saveChartSettings (id: number, settings: any): Promise<any> {
        return this.socket.send(new PostChartSettings({id, ...settings}));
    }

    getTemplates (codes: string[] = this.config.charts): Promise<any> {
        /*return Promise.resolve([
            require('./chart-templates/pmc.json') as string,
            require('./chart-templates/actualMovingDuration.json') as string]);*/
        return Promise.all(codes.map(c =>
            this.$http.get(`${this.config.dir}/${c}.json`).then(r => r.data)));
    }
}