import SocketManager from "../dataStore/SocketManager";
import { RedisUserEntry } from "../types/RedisEntries";
import { RedisClient } from "../utils/db/RedisClient";
import ConsoleLogger from "../utils/logger/ConsoleLogger";
import { ILogger } from "../utils/logger/interface/ILogger";
import { Worker } from "worker_threads";
import { RedisOptions } from "ioredis";

class MessageRelayService {
    private _worker: Worker;
    private _logger: ILogger;
    private _redisClient: RedisClient;
    private _socketManager: SocketManager;
    private _instanceName: string;
    constructor(instanceName: string, redisOptions: RedisOptions) {
        this._instanceName = instanceName;
        this._worker = new Worker("./dist/worker/MessageWatcher.js");
        this._logger = ConsoleLogger.GetInstance();
        try {
            this._redisClient = RedisClient.GetInstance();
        } catch (ex) {
            this._redisClient = RedisClient.Initialize(redisOptions);
        }
        try {
            this._socketManager = SocketManager.GetInstance();
        } catch (ex) {
            this._socketManager = SocketManager.Initialize();
        }
    }

    public run() {
        this._worker.on("message", async (result) => {
            let messageId = result as string;
            this._logger.Info("Received message id {0}", result);

            let serializedMsg = await this._redisClient.GetKeyFromHashSet(
                this._instanceName+"-Commands",
                messageId
            );
            if (serializedMsg != null) {
                try {
                    let msg: BrokerMessage;
                    msg = JSON.parse(serializedMsg);
                    let relayMsg: SocketMessage = JSON.parse(serializedMsg);
                    //Relay message to all users
                    msg.audience.forEach(async (x) => {
                        let serializedReceipient =
                            await this._redisClient.GetValueForKey(x);
                        if (
                            serializedReceipient != null &&
                            serializedReceipient != undefined
                        ) {
                            let recepient: RedisUserEntry =
                                JSON.parse(serializedReceipient);
                            let socket = this._socketManager.GetSocketForUser(
                                recepient.SocketId
                            );
                            if (socket != null) {
                                socket.Socket.transmit("command", relayMsg, {});
                            }
                        }
                    });
                    await this._redisClient.RemoveItemFromSortedSet(
                        this._instanceName,
                        messageId
                    );
                    await this._redisClient.RemoveKeyFromHashSet(
                        this._instanceName+"-Commands",
                        messageId
                    );
                } catch (ex) {
                    this._logger.Error(
                        "Failed to process message",
                        messageId,
                        ex
                    );
                }
            }
        });
    }
}

export { MessageRelayService };
