"use strict";

import { AGServerSocket } from "socketcluster-server";
import SocketManager from "../dataStore/SocketManager";
import { RedisClient } from "../utils/db/RedisClient";
import { SessionUser, UserSocket } from "../types/SocketConnection";
import { RedisUserEntry } from "../types/RedisEntries";
import { ILogger } from "../utils/logger/interface/ILogger";
import {
    NotificationType,
    PresenseUpdate,
} from "../types/PresenseNotification";
import RestClient from "../utils/rest/RestClient";

class SocketService {
    private _instanceName: string;
    private _logger: ILogger;

    private static _instance: SocketService;

    private _mbHost: string;
    private _endpoint: string;

    private _socketManager: SocketManager | null;
    private _redisClient: RedisClient | null;

    public static Initialize(
        instanceName: string,
        mbHost: string,
        logger: ILogger
    ) {
        this._instance = new SocketService();

        this._instance._mbHost = mbHost;
        this._instance._endpoint = "api/v1/presence";
        this._instance._instanceName = instanceName;
        this._instance._logger = logger;

        this._instance._socketManager = SocketManager.GetInstance() ?? null;
        this._instance._redisClient = RedisClient.GetInstance() ?? null;
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
        if (this._socketManager != undefined && this._socketManager != null) {
            this._socketManager.RegisterSocket(socketInstance, sessionUser.Id);
        }

        let redisData = await this.addSocketInstanceToCache(
            sessionUser,
            socketInstance.id
        );

        await this.sendPresenseUpdate(NotificationType.Added, redisData);
    }

    public async GetSocketUser(userId: string): Promise<UserSocket | null> {
        try {
            let redisUser = await this.getSocketInstanceFromCache(userId);
            let socket = this._socketManager?.GetSocketForUser(
                redisUser.SocketId
            );
            return socket ?? null;
        } catch (ex) {
            this._logger.Error(
                "Failed to fetch user socket for id {0}",
                userId
            );
            throw ex;
        }
    }

    public async RemoveUserSocket(userId: string) {
        this._logger.Info(
            "Removing user with id {0} from cache and socket manager",
            userId
        );
        let redisUser = await this.removeSocketInstanceFromCache(userId);

        this._socketManager?.DeleteSocketEntry(redisUser.SocketId);
        await this.sendPresenseUpdate(NotificationType.Removed, redisUser);
    }

    private async getSocketInstanceFromCache(
        userId: string
    ): Promise<RedisUserEntry> {
        let client = this._redisClient;
        try {
            let serializedRedisEntry = await client!.GetValueForKey(userId);
            let redisEntry: RedisUserEntry = JSON.parse(
                serializedRedisEntry ?? ""
            );
            await this.sendPresenseUpdate(NotificationType.Removed, redisEntry);
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

    private async removeSocketInstanceFromCache(
        userId: string
    ): Promise<RedisUserEntry> {
        let client = this._redisClient;
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

            return redisEntry;
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
    ): Promise<RedisUserEntry> {
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

        if (this._redisClient != undefined && this._redisClient != null) {
            let promises: Array<Promise<void>> = new Array<Promise<void>>();
            let redisClient = this._redisClient;
            promises.push(
                this._redisClient.SetKeyValueBuffered(
                    sessionUser.Id,
                    redisEntry
                )
            );
            promises.push(
                this._redisClient.SetKeyValueBuffered(
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
        return redisEntry;
    }

    private async sendPresenseUpdate(
        changeType: NotificationType,
        sessionUser: RedisUserEntry
    ) {
        let update: PresenseUpdate = {
            NotificationType: changeType,
            UserId: sessionUser.Id,
            NotifiedEntities: [],
        };

        sessionUser.Sessions.map((x, _) => {
            update.NotifiedEntities.push({
                EntityType: "Session",
                EntityId: x,
            });
        });

        let auth: Record<string, string> = {
            key: "Authorization",
            value: "plsNoHack",
        };

        await RestClient.post(this._mbHost, this._endpoint, auth, update);
    }
}

export default SocketService;
