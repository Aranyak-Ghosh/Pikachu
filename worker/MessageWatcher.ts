import { RedisClient } from "utils/db/RedisClient";
import { parentPort } from "worker_threads";

import dotenv from "dotenv";
import { ILogger } from "utils/logger/interface/ILogger";
import ConsoleLogger from "utils/logger/ConsoleLogger";
dotenv.config();

let instanceName = process.env.INSTANCE_NAME || "pikachu";

let redisClient: RedisClient;
redisClient = RedisClient.Initialize();

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
