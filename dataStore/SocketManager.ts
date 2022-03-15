"use strict";

import { AGServerSocket } from "socketcluster-server";
import { ClientNotInitializedError } from "../types/Errors";
import { UserSocket } from "../types/SocketConnection";
class SocketManager {
    //Collection of sockets mapped to userId
    private _sockets: Record<string, UserSocket>;
    private static readonly CLIENT_TYPE: string = "SocketManager";
    private static _instance?: SocketManager;

    private constructor() {}

    public static Initialize(): SocketManager {
        const socketManager = new SocketManager();

        socketManager._sockets = {};

        SocketManager._instance = socketManager;

        return socketManager;
    }

    public static GetInstance(): SocketManager | undefined {
        if (
            SocketManager._instance != null &&
            SocketManager._instance != undefined
        ) {
            return SocketManager._instance;
        } else throw new ClientNotInitializedError(SocketManager.CLIENT_TYPE);
    }

    public static DeleteInstance(): void {
        if (SocketManager._instance != undefined)
            delete SocketManager._instance;
    }

    public RegisterSocket(socket: AGServerSocket, userId: string) {
        this._sockets[socket.id] = { Socket: socket, UserId: userId };
    }

    public GetSocketForUser(socketId: string): UserSocket | null {
        return this._sockets[socketId];
    }

    public DeleteSocketEntry(socketId: string) {
        if (
            this._sockets[socketId] != undefined &&
            this._sockets[socketId] != null
        ) {
            delete this._sockets[socketId];
        }
    }
}

export default SocketManager;
