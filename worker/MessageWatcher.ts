import { RedisClient } from "../utils/db/RedisClient";
import { parentPort } from "worker_threads";

import dotenv from "dotenv";
import { ILogger } from "../utils/logger/interface/ILogger";
import ConsoleLogger from "../utils/logger/ConsoleLogger";
import { RedisOptions } from "ioredis";
dotenv.config();

let instanceName = process.env.POD_NAME || "pikachu";
const DATABASE_PORT =
    process.env.DATABASE_PORT == null || process.env.DATABASE_PORT == undefined
        ? 6379
        : parseInt(process.env.DATABASE_PORT!);
const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

let redisOptions: RedisOptions = {
    port: DATABASE_PORT,
    host: DATABASE_HOST,
    reconnectOnError: (err): boolean => {
        ConsoleLogger.GetInstance().Debug("Disconnected from redis", err);
        return true;
    },
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
};

let redisClient: RedisClient;
redisClient = RedisClient.Initialize(redisOptions);

let logger: ILogger;
logger = ConsoleLogger.GetInstance();

while (true) {
    redisClient
        .GetItemsFromSortedSet(instanceName, 1)
        .then((res) => {
            let messageId = res;
            if (messageId != null && messageId.length > 0)
                parentPort?.postMessage(messageId[0]);
        })
        .catch((err) => {
            logger.Error("Failed to read from zset", err);
        });
}
