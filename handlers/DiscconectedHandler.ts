"use strict";

import SocketService from "../services/SocketService";
import { AGServerSocket } from "socketcluster-server";
import { ILogger } from "../utils/logger/interface/ILogger";

async function onClientDisconnected(
    socket: AGServerSocket,
    disconnectCode: number,
    disconnectReason: string,
    logger: ILogger
) {
    logger.Info(
        "Socket with socketId {0} disconnected with code: {1} reason: {2}",
        socket.id,
        disconnectCode,
        disconnectReason
    );

    if (socket.authToken && socket.authToken!.Id) {
        let service = SocketService.GetInstance();
        let userSocket = await service.GetSocketUser(socket.authToken.Id);
        //TODO: Queue user disconnected message
        await service.RemoveUserSocket(userSocket!.UserId);
    }
}

export default onClientDisconnected;
