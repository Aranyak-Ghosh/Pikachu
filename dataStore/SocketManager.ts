"use strict";

import { AGServerSocket } from "socketcluster-server";
import { ClientNotInitializedError } from "../types/Errors";

class SocketManager {
    //Collection of sockets mapped to userId
    private _sockets: Record<string, AGServerSocket>;
    private static readonly CLIENT_TYPE : string = "SocketManager"
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

    public RegisterSocket(userId: string, socket: AGServerSocket) {
        this._sockets[userId] = socket;
    }

    public GetSocketForUser(userId: string): AGServerSocket | null {
        return this._sockets[userId];
    }

    public DeleteSocketEntry(userId: string) {
        if (
            this._sockets[userId] != undefined &&
            this._sockets[userId] != null
        ) {
            delete this._sockets[userId];
        }
    }
}

export default SocketManager;
