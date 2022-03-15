"use strict";

import SocketManager from "dataStore/SocketManager";
import SocketService from "services/SocketService";
import { SocketServerOptions } from "Types/SocketServerOptions";
import { RedisClient } from "utils/db/RedisClient";
import ConsoleLogger from "utils/logger/ConsoleLogger";

async function onServerReadyHandler(serverOptions: SocketServerOptions) {
    initializeDependencies(
        serverOptions.serverName,
        serverOptions.messageBrokerURL
    );
}

function initializeDependencies(
    instanceName: string,
    messageBrokerUrl: string
) {
    RedisClient.Initialize();
    SocketManager.Initialize();
    let logger = new ConsoleLogger();
    SocketService.Initialize(instanceName, messageBrokerUrl, logger);
}

export default onServerReadyHandler;
