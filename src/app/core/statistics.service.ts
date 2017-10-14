import {IReportResponse, IReportRequestData} from "../../../api/statistics/statistics.interface";
import {ISocketService} from "./socket.service-ajs";
import {GetIChartMetrics} from "../../../api/statistics/statistics.request";

/**
 *
 */
export default class StatisticsService {

    static $inject = ['SocketService'];

    constructor(private socket: ISocketService) {

    }

    /**
     * @desc Запрос данных по разширенной аналитике
     * @param request
     * @returns {Promise<any>}
     */
    getMetrics(request: IReportRequestData):Promise<IReportResponse> {
        return this.socket.send(new GetIChartMetrics(request));
    }

}