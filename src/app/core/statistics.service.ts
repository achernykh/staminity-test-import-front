import {IReportRequestData, IReportResponse} from "../../../api/statistics/statistics.interface";
import {GetIChartMetricsRequest} from "../../../api/statistics/statistics.request";
import {SocketService} from "./index";

/**
 *
 */
export default class StatisticsService {

    public static $inject = ["SocketService"];

    constructor(private socket: SocketService) {

    }

    /**
     * @desc Запрос данных по разширенной аналитике
     * @param request
     * @returns {Promise<any>}
     */
    public getMetrics(request: IReportRequestData): Promise<IReportResponse> {
        return this.socket.send(new GetIChartMetricsRequest(request));
    }

}
