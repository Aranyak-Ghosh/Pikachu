'use strict'

import http from "http"
import * as SocketClusterServer from "socketcluster-server"
import { v4 } from "uuid"

import { SocketServerOptions } from "../types/SocketServerOptions"
import { ILogger } from "../utils/logger/interface/ILogger"

class SocketClusterServerInstance {
    private _httpServer?: http.Server;
    private _scServer?: SocketClusterServer.AGServer;

    private _logger: ILogger;

    private _instanceId: string;

    private _serverOptions: SocketServerOptions;

    private readonly CONNECT_EVENT = "connection";
    private readonly CONNECT_FAIL = 'connectionAbort'
    private readonly DISCONNECT_EVENT = "disconnect";
    private readonly ERROR_EVENT = "error";
    private readonly WARNING_EVENT = "warning";
    private readonly READY_EVENT = "ready";
    private readonly BAD_TOKEN = "badSocketAuthToken";
    private readonly AUTHENTICATED = "authenticated";


    constructor(serverOptions: SocketServerOptions, logger: ILogger) {
        this._serverOptions = serverOptions;
        this._instanceId = v4().toString();
        this._logger = logger;
        this.initialize();
    }

    public GetInstanceId(): string {
        return this._instanceId;
    }




    private initialize(): void {
        this._logger.Info("Initializing Socket Cluster Server")

        if (this._httpServer == undefined) {
            this._httpServer = http.createServer();
        }

        if (this._scServer == undefined) {
            this._scServer = SocketClusterServer.attach(this._httpServer, {
                port: this._serverOptions.port,
                wsEngine: this._serverOptions.wsEngine,
                wsEngineOptions: this._serverOptions.wsEngineOptions,
                handshakeTimeout: this._serverOptions.handshakeTimeout,
                pingTimeout: this._serverOptions.pingTimeout,
                ackTimeout: this._serverOptions.ackTimeout,
                pingInterval: this._serverOptions.pingInterval
            });
        }

        this._logger.Info("Registering Event Handlers")
        //Register Listeners

        //Start Server
        // Setup HTTP server to listen on given port
        this._httpServer.listen(this._serverOptions.port);
        this._logger.Info("Server initialized on port - ", this._serverOptions.port);
    }



}

export default SocketClusterServerInstance