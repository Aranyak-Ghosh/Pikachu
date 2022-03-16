import SocketManager from "dataStore/SocketManager";
import { RedisClient } from "utils/db/RedisClient";
import ConsoleLogger from "utils/logger/ConsoleLogger";
import { ILogger } from "utils/logger/interface/ILogger";
import { Worker } from "worker_threads";

class MessageRelayService {
    private _worker: Worker;
    private _logger: ILogger;
    private _redisClient: RedisClient;
    private _socketManager: SocketManager;
    private _instanceName: string;
    constructor(instanceName: string) {
        this._instanceName = instanceName;
        this._worker = new Worker("../worker/MessageWatcher.ts");
        this._logger = ConsoleLogger.GetInstance();
        try {
            this._redisClient = RedisClient.GetInstance();
        } catch (ex) {
            this._redisClient = RedisClient.Initialize();
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

            let serializedMsg = await this._redisClient.GetKeyFromHashSet(this._instanceName,messageId);
            let msg : SocketMessage
            if(serializedMsg!=null){
                msg = JSON.parse(serializedMsg);
                //Relay message to all users
            }
        });
    }
}

export {MessageRelayService}