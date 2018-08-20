import {AnalyticsConfig} from "@app/analytics/analytics.constants";
import {IHttpService} from "angular";

export class AnalyticsService {
    static $inject = ['$http', 'analyticsConfig'];
    constructor (private $http: IHttpService,
                 private config: AnalyticsConfig) {

    }

    downloadTemplate (codes: string[] = this.config.charts): Promise<any> {
        return Promise.all(codes.map(c => this.$http.get(`${this.config.dir}/${c}.json`)));
    }
}