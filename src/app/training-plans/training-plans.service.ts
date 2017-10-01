import {ISocketService} from "../core/socket.service";

export class TrainingPlansService {

    static $inject = ['SocketService'];

    constructor(private socket: ISocketService) {

    }
}