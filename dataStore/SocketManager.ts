'use strict';

import { AGServerSocket } from "socketcluster-server";
import { UserSocket } from "../Types/SocketConnection"

class SocketManager {

    //Collection of sockets mapped to userId
    private _sockets: Record<string, UserSocket>;

    //Instance name for socket cluster server
    private _instanceName: string;

    private static _instance?: SocketManager;

    private constructor() {
    }

    public static Initialize(instanceName: string): SocketManager {
        const socketManager = new SocketManager();

        socketManager._sockets = {};
        socketManager._instanceName = instanceName;

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


}