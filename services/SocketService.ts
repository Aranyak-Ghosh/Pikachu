"use strict";

import SocketManager from "dataStore/SocketManager";
import { AGServerSocket } from "socketcluster-server";
import { RedisClient } from "../utils/db/RedisClient";
import { SessionUser } from "../types/SocketConnection";
import { RedisUserEntry } from "../types/RedisEntries";
import { ILogger } from "utils/logger/interface/ILogger";
class SocketService {
    private _instanceName: string;
    private _logger: ILogger;

    private static _instance: SocketService;

    private socketManager: SocketManager | null;
    private redisClient: RedisClient | null;

    public static Initialize(instanceName: string, logger: ILogger) {
        this._instance = new SocketService();

        this._instance._instanceName = instanceName;
        this._instance._logger = logger;

        this._instance.socketManager = SocketManager.GetInstance() ?? null;
        this._instance.redisClient = RedisClient.GetInstance() ?? null;
    }

    public static GetInstance(): SocketService {
        return this._instance;
    }

    constructor() {}

    public async RegisterUserSocket(
        socketInstance: AGServerSocket,
        sessionUser: SessionUser
    ) {
        this._logger.Info(
            "Registering user with id {0} to cache and socket manager",
            sessionUser.Id
        );
        if (this.socketManager != undefined && this.socketManager != null) {
            this.socketManager.RegisterSocket(socketInstance, sessionUser.Id);
        }

        await this.addSocketInstanceToCache(sessionUser, socketInstance.id);
    }

    public async GetSocketUser(userId: string): Promise<AGServerSocket | null> {
        try {
            let redisUser = await this.getSocketInstanceFromCache(userId);
            let socket = this.socketManager?.GetSocketForUser(
                redisUser.SocketId
            );
            return socket ? socket.Socket : null;
        } catch (ex) {
            this._logger.Error(
                "Failed to fetch user socket for id {0}",
                userId
            );
            throw ex;
        }
    }

    public async RemoveUserSocket(userId: string) {
        await this.removeSocketInstanceFromCache(userId);
    }

    private async getSocketInstanceFromCache(
        userId: string
    ): Promise<RedisUserEntry> {
        let client = this.redisClient;
        try {
            let serializedRedisEntry = await client!.GetValueForKey(userId);
            let redisEntry: RedisUserEntry = JSON.parse(
                serializedRedisEntry ?? ""
            );
            return redisEntry;
        } catch (ex) {
            this._logger.Error(
                "Unable to read user info for userid {0} from cache",
                userId,
                ex
            );
            throw ex;
        }
    }

    private async removeSocketInstanceFromCache(userId: string) {
        let client = this.redisClient;
        try {
            let serializedRedisEntry = await client!.GetValueForKey(userId);
            let redisEntry: RedisUserEntry = JSON.parse(
                serializedRedisEntry ?? ""
            );

            let promises: Array<Promise<void>> = new Array<Promise<void>>();
            promises.push(client!.ExpireKeyValue(userId));
            redisEntry.Hearings.forEach((hearingId) => {
                promises.push(client!.AddToSet(hearingId, userId));
            });

            redisEntry.Sessions.forEach((sessionId) => {
                promises.push(client!.AddToSet(sessionId, userId));
            });

            await Promise.all(promises);
        } catch (ex) {
            this._logger.Error(
                "Unable to read/remove user info for userid {0} from cache",
                userId,
                ex
            );
            throw ex;
        }
    }

    private async addSocketInstanceToCache(
        sessionUser: SessionUser,
        SocketID: string
    ) {
        let redisEntry: RedisUserEntry;

        redisEntry = {
            SocketId: SocketID,
            Type: sessionUser.Type,
            State: sessionUser.State,
            Id: sessionUser.Id,
            Email: sessionUser.Email,
            ServerInstance: this._instanceName,
            Sessions: sessionUser.SessionIds,
            Hearings: sessionUser.HearingIds,
            FirstName: sessionUser.FirstName,
            LastName: sessionUser.LastName,
        };

        if (this.redisClient != undefined && this.redisClient != null) {
            let promises: Array<Promise<void>> = new Array<Promise<void>>();
            let redisClient = this.redisClient;
            promises.push(
                this.redisClient.SetKeyValueBuffered(sessionUser.Id, redisEntry)
            );
            promises.push(
                this.redisClient.SetKeyValueBuffered(
                    sessionUser.Email,
                    redisEntry
                )
            );

            sessionUser.HearingIds.forEach((hearingId) => {
                promises.push(redisClient.AddToSet(hearingId, sessionUser.Id));
            });

            sessionUser.SessionIds.forEach((sessionId) => {
                promises.push(redisClient.AddToSet(sessionId, sessionUser.Id));
            });

            await Promise.all(promises);
        }
    }
}

export default SocketService;
