"use strict";

import {
    SocketServerOptions,
} from "./Types/SocketServerOptions";

import { v4 } from "uuid";

import dotenv from "dotenv";
import SocketClusterServerInstance from "server/SocketClusterServer";
import ConsoleLogger from "utils/logger/ConsoleLogger";
dotenv.config();

// const ENVIRONMENT = process.env.ENV || "dev";

const SOCKETCLUSTER_PORT = process.env.SOCKETCLUSTER_PORT || 8000;
const SOCKETCLUSTER_WS_ENGINE = process.env.SOCKETCLUSTER_WS_ENGINE || "ws";
// const SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT =
//     Number(process.env.SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT) || 1000;
// const SOCKETCLUSTER_LOG_LEVEL = process.env.SOCKETCLUSTER_LOG_LEVEL || 2;

const SCC_INSTANCE_ID = v4();
const SCC_STATE_SERVER_HOST = process.env.SCC_STATE_SERVER_HOST || "localhost";
const SCC_STATE_SERVER_PORT = Number(process.env.SCC_STATE_SERVER_PORT) || 8080;
// const SCC_MAPPING_ENGINE = process.env.SCC_MAPPING_ENGINE || null;
// const SCC_CLIENT_POOL_SIZE = process.env.SCC_CLIENT_POOL_SIZE || null;
// const SCC_AUTH_KEY = process.env.SCC_AUTH_KEY || null;
// const SCC_INSTANCE_IP = process.env.SCC_INSTANCE_IP || null;
// const SCC_INSTANCE_IP_FAMILY = process.env.SCC_INSTANCE_IP_FAMILY || null;
// const SCC_STATE_SERVER_CONNECT_TIMEOUT =
//     Number(process.env.SCC_STATE_SERVER_CONNECT_TIMEOUT) || null;
// const SCC_STATE_SERVER_ACK_TIMEOUT =
//     Number(process.env.SCC_STATE_SERVER_ACK_TIMEOUT) || null;
// const SCC_STATE_SERVER_RECONNECT_RANDOMNESS =
//     Number(process.env.SCC_STATE_SERVER_RECONNECT_RANDOMNESS) || null;
// const SCC_PUB_SUB_BATCH_DURATION =
//     Number(process.env.SCC_PUB_SUB_BATCH_DURATION) || null;
// const SCC_BROKER_RETRY_DELAY =
//     Number(process.env.SCC_BROKER_RETRY_DELAY) || null;
const DATABASE_URL = process.env.DATABASE_URL || "redis://localhost:6379";
const MESSAGE_BROKER_URL =
    process.env.MESSAGE_BROKER_URL || "http://localhost:3199";

let agOptions: SocketServerOptions = {
    port: parseInt(SOCKETCLUSTER_PORT.toString()),
    wsEngine: SOCKETCLUSTER_WS_ENGINE,
    serverName: SCC_INSTANCE_ID,
    wsEngineOptions: { maxPayload: 10 },
    handshakeTimeout: 10000,
    pingTimeout: 20000,
    ackTimeout: 10000,
    pingInterval: 8000,
    databaseURL: DATABASE_URL,
    messageBrokerURL: MESSAGE_BROKER_URL,
    serverHost: SCC_STATE_SERVER_HOST,
    serverPort: SCC_STATE_SERVER_PORT,
};

new SocketClusterServerInstance(
    agOptions,
    ConsoleLogger.GetInstance()
);
