import RedisModule from "ioredis";
import ConsoleLogger from "../logger/ConsoleLogger";

import { ClientNotInitializedError } from "../../types/Errors";
import { ILogger } from "../logger/ILogger";

class RedisClient {
    private _client: RedisModule.Redis;
    private static _instance?: RedisClient;
    private static readonly CLIENT_TYPE: string = "Redis";
    private _logger: ILogger;

    private TTL: number;

    public static Initialize(options?: RedisModule.RedisOptions): RedisClient {
        RedisClient._instance = new RedisClient();

        RedisClient._instance._logger = ConsoleLogger.GetInstance();

        RedisClient._instance.TTL = 86400;

        if (options == null || options == undefined) {
            RedisClient._instance._client = new RedisModule();
        } else {
            RedisClient._instance._client = new RedisModule(options);
        }
        return RedisClient._instance;
    }

    public GetInstance(): RedisClient {
        if (
            RedisClient._instance != null &&
            RedisClient._instance != undefined
        ) {
            return RedisClient._instance;
        } else throw new ClientNotInitializedError(RedisClient.CLIENT_TYPE);
    }

    public async PublishMessage(channel: string, message: any) {
        this._logger.Info("Publishing {0} to channel {1}", message, channel);
        try {
            var data = Buffer.from(JSON.stringify(message));
            await this._client.publishBuffer(channel, data);
        } catch (ex) {
            this._logger.Error("Unable to publish message to redis", ex);
            throw ex;
        }
    }

    public async SetKeyValueBuffered(
        key: RedisModule.KeyType,
        value: any,
        ttl?: number
    ) {
        this._logger.Info("Setting {0} with {1} value", key, value);
        try {
            var data = Buffer.from(JSON.stringify(value));
            if (ttl == undefined) ttl = this.TTL;

            await this._client.set(key, data, "ex", ttl);
        } catch (ex) {
            this._logger.Error("Unable to write to redis", ex);
            throw ex;
        }
    }

    public async GetValueForKey(
        key: RedisModule.KeyType
    ): Promise<string | null> {
        this._logger.Info("Fetching key {0}", key);
        let data = await this._client.get(key);

        return data;
    }

    public Disconnect() {
        if (this._client != undefined && this._client != null) {
            this._client.disconnect();
        }
    }
}

export { RedisClient };
