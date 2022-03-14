'use strict';
import RedisModule from "ioredis";
import ConsoleLogger from "../logger/ConsoleLogger";

import { ClientNotInitializedError } from "../../types/Errors";
import { ILogger } from "../logger/interface/ILogger";

class RedisClient {
    private _subscriberClient: RedisModule.Redis;
    private _client: RedisModule.Redis;
    private static _instance?: RedisClient;
    private static readonly CLIENT_TYPE: string = "Redis";
    private _logger: ILogger;

    private callbacks: Record<string, Function>;

    private TTL: number;

    public static Initialize(options?: RedisModule.RedisOptions): RedisClient {
        RedisClient._instance = new RedisClient();

        RedisClient._instance._logger = ConsoleLogger.GetInstance();

        RedisClient._instance.callbacks = {}

        RedisClient._instance.TTL = 86400;

        if (options == null || options == undefined) {
            RedisClient._instance._client = new RedisModule();
            RedisClient._instance._subscriberClient = new RedisModule();
        } else {
            RedisClient._instance._subscriberClient = new RedisModule(options);
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

    public async SubscribeToChannel(chan: string, onMessageReceived: Function) {
        this._logger.Info("Subscribing to channel {0}", chan)
        this.callbacks[chan] = onMessageReceived;
        try {
            this._subscriberClient.on("message", (channel, message) => {
                let cb = this.callbacks[channel];
                if (cb != null && cb != undefined) {
                    cb(message);
                }
            })
        } catch (ex) {
            this._logger.Error("Failed to subscribe to channel", ex)
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
        try {
            let data = await this._client.get(key);
            return data;
        } catch (ex) {
            this._logger.Error("Unable to get key {0} redis", key, ex);
            throw ex;
        }
    }

    public async AppendToList(key: RedisModule.KeyType, value: RedisModule.ValueType) {

        this._logger.Info("Appending {0} to key {1} in redis", value, key)
        try {

            await this._client.append(
                key,
                value
            );
        } catch (ex) {
            this._logger.Error("Unable to write to redis", ex);
            throw ex;
        }
    }

    public async AddToSet(key: RedisModule.KeyType, value: RedisModule.ValueType) {
        this._logger.Info("Appending {0} to key {1} in redis", value, key)
        try {
            await this._client.sadd(key, value)
        } catch (ex) {
            this._logger.Error("Unable to write to redis", ex);
            throw ex;
        }
    }

    public async ListSetItems(key: RedisModule.KeyType): Promise<Array<string>> {
        this._logger.Info("Listing items from set {0}", key)
        try {
            var data = await this._client.smembers(key);
            return data;
        } catch (ex) {
            this._logger.Error("Unable to read key {0} from redis", key, ex);
            throw ex;
        }
    }

    public async RemoveFromSet(key: RedisModule.KeyType, value: RedisModule.ValueType) {
        this._logger.Info("Removing value {0} from set {1}", key, value);
        try {
            await this._client.srem(key, value)
        } catch (ex) {
            this._logger.Error("Unable to delete value {0} from key {1} from redis", value, key, ex);
            throw ex;
        }
    }

    public async SetKeyToHashSet(key: RedisModule.KeyType, field: string, value: RedisModule.ValueType) {
        this._logger.Info("Adding value {0} to hashset {1} with hashkey {2}", value, key, field)
        try {
            await this._client.hset(key, field, value)
        } catch (ex) {
            this._logger.Error("Unable to write to redis", ex);
            throw ex;
        }
    }

    public async GetKeyFromHashSet(key: RedisModule.KeyType, field: string): Promise<string | null> {
        this._logger.Info("Getting hashkey {0} from Key {1}", field, key)
        try {
            let data = await this._client.hget(key, field)
            return data;
        } catch (ex) {
            this._logger.Error("Unable to read key {0} from redis", key, ex);
            throw ex;
        }
    }

    public async RemoveKeyFromHashSet(key: RedisModule.KeyType, field: string) {
        this._logger.Info("Removing field {0} from set {1}", field, key);
        try {
            await this._client.hdel(key, field)
        } catch (ex) {
            this._logger.Error("Unable to delete field {0} from key {1} from redis", field, key, ex);
            throw ex;
        }
    }

    public async AddToSortedSet(key: RedisModule.KeyType, value: string, priority: number = 0) {
        this._logger.Info("Adding {0} to sorted set {1}", value, key)
        try {
            await this._client.zadd(key, priority, value);
        } catch (ex) {
            this._logger.Error("Failed to add {0} to sorted set {1}", value, key, ex)
            throw ex;
        }
    }

    public async GetItemsFromSortedSet(key: RedisModule.KeyType, numItems: number = 1): Promise<Array<string>> {
        this._logger.Info("Fetching {0} items from {1}", numItems, key);
        try {
            let data = this._client.zrange(key, 0, numItems - 1);
            return data;
        } catch (ex) {
            this._logger.Error("Failed to fetch data from {0}", key);
            throw ex;
        }
    }

    public async RemoveItemFromSortedSet(key: RedisModule.KeyType, items: RedisModule.ValueType) {
        this._logger.Info("Removing item {0} from sorted set with {1}", items, key)
        try {
            await this._client.zrem(key, items);
        } catch (ex) {
            this._logger.Error("Failed to remove item {0} from set {1}", items, key);
            throw ex;
        }
    }

    private Disconnect() {
        if (this._client != undefined && this._client != null) {
            this._client.disconnect();
        }

        if (this._subscriberClient != undefined && this._subscriberClient != null) {
            this._subscriberClient.disconnect();
        }
    }

    public static DeInitialize(){
        if(this._instance != undefined && this._instance != null){
            RedisClient._instance?.Disconnect();
            delete RedisClient._instance;
        }
    }
}

export { RedisClient };
