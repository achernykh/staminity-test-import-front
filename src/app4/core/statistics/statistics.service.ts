import { IReportResponse, IReportRequestData } from "../../../../api/statistics/statistics.interface";
import { SocketService } from "../socket/socket.service";
import { GetIChartMetrics } from "../../../../api/statistics/statistics.request";
import { Injectable } from "@angular/core";

@Injectable()
export class StatisticsService {

    constructor(private socket: SocketService) {

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