'use strict';

import { UserSocket } from "../Types/SocketConnection"

class SocketManager {

    //Collection of sockets mapped to userId
    private _sockets: Record<string, UserSocket>;

    private static _instance?: SocketManager;

    private constructor() {
    }

    public static Initialize(): SocketManager {
        const socketManager = new SocketManager();

        socketManager._sockets = {};

        SocketManager._instance = socketManager;

        return socketManager;
    }

    public static GetInstance(): SocketManager | undefined {
        return SocketManager._instance;
    }

    public static DeleteInstance(): void {
        if (SocketManager._instance != undefined)
            delete SocketManager._instance;
    }

    public RegisterSocket(userId: string, socket: UserSocket) {
        this._sockets[userId] = socket;
    }

    public GetSocketForUser(userId: string): UserSocket | null {
        return this._sockets[userId]
    }

    public DeleteSocketEntry(userId: string) {
        if (this._sockets[userId] != undefined && this._sockets[userId] != null) {
            delete this._sockets[userId];
        }
    }
}

export default SocketManager