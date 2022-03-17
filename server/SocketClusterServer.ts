"use strict";

import http from "http";
import * as SocketClusterServer from "socketcluster-server";
import { v4 } from "uuid";

import onClientConnectedHandler from "../handlers/ConnectionHandler";
import onClientDisconnected from "../handlers/DiscconectedHandler";
import onServerReadyHandler from "../handlers/ServerInitHandler";
import ConsoleLogger from "../utils/logger/ConsoleLogger";
import { SocketServerOptions } from "../types/SocketServerOptions";
import { ILogger } from "../utils/logger/interface/ILogger";

class SocketClusterServerInstance {
    private _httpServer?: http.Server;
    private _scServer?: SocketClusterServer.AGServer;

    private _logger: ILogger;

    private _instanceId: string;

    private _serverOptions: SocketServerOptions;

    private readonly CONNECT_EVENT = "connection";
    // private readonly CONNECT_FAIL = "connectionAbort";
    private readonly DISCONNECT_EVENT = "disconnection";
    private readonly ERROR_EVENT = "error";
    private readonly WARNING_EVENT = "warning";
    // private readonly BAD_TOKEN = "badSocketAuthToken";
    // private readonly AUTHENTICATED = "authenticated";

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
        this._logger.Info("Initializing Socket Cluster Server");

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
                pingInterval: this._serverOptions.pingInterval,
            });
        }

        this._logger.Info("Registering Event Handlers");
        //Register Listeners
        this.registerServerReadyListener();
        this.registerWarningListener();
        this.registeErrorListener();
        //Start Server
        // Setup HTTP server to listen on given port
        this._httpServer.listen(this._serverOptions.port);
        this._logger.Info(
            "Server initialized on port - ",
            this._serverOptions.port
        );
    }

    private registerServerReadyListener() {
        onServerReadyHandler(this._serverOptions);
        this.registerClientConnectedListener();
        this.registerClientDisconnectedListener();
    }
    private async registerWarningListener() {
        if (this._scServer != undefined && this._scServer != null) {
            for await (let { warning } of this._scServer!.listener(
                this.WARNING_EVENT
            )) {
                ConsoleLogger.GetInstance().Warn(
                    "SockerClusterWarning",
                    warning
                );
            }
        } else throw new Error("Socket Server not initialized");
    }
    private async registeErrorListener() {
        if (this._scServer != undefined && this._scServer != null) {
            for await (let { error } of this._scServer!.listener(
                this.ERROR_EVENT
            )) {
                ConsoleLogger.GetInstance().Error("SockerClusterError", error);
            }
        } else throw new Error("Socket Server not initialized");
    }
    private async registerClientDisconnectedListener() {
        if (this._scServer != undefined && this._scServer != null) {
            for await (let { socket, code, reason } of this._scServer!.listener(
                this.DISCONNECT_EVENT
            )) {
                onClientDisconnected(
                    socket,
                    code,
                    reason,
                    ConsoleLogger.GetInstance()
                );
            }
        } else throw new Error("Socket Server not initialized");
    }
    private async registerClientConnectedListener() {
        if (this._scServer != undefined && this._scServer != null) {
            for await (let { socket } of this._scServer!.listener(
                this.CONNECT_EVENT
            )) {
                onClientConnectedHandler(socket, ConsoleLogger.GetInstance());
            }
        } else throw new Error("Socket Server not initialized");
    }
}

export default SocketClusterServerInstance;
