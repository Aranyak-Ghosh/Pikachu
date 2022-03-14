"use strict";

import SocketManager from "dataStore/SocketManager";
import { AGServerSocket } from "socketcluster-server";
import { RedisClient } from "../utils/db/RedisClient";
import { SessionUser } from "../types/SocketConnection";
import { RedisUserEntry } from "../types/RedisEntries";
class SocketService {
    private _instanceName: string;
    constructor(instanceName: string) {
        this._instanceName = instanceName;
    }

    public async RegisterUserSocket(
        socketInstance: AGServerSocket,
        sessionUser: SessionUser
    ) {
        let socketManager = SocketManager.GetInstance();
        if (socketManager != undefined && socketManager != null) {
            socketManager.RegisterSocket(sessionUser.Id, socketInstance);
        }

        await this.addSocketInstanceToCache(sessionUser);
    }

    public async GetSocketUser() {
        throw new Error("NotImplementedException");
    }

    public async RemoveUserSocket() {
        throw new Error("NotImplementedException");
    }

    private async addSocketInstanceToCache(sessionUser: SessionUser) {
        let redisEntry: RedisUserEntry;

        redisEntry = {
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

        let redisClient = RedisClient.GetInstance();
        if (redisClient != undefined && redisClient != null) {
            let promises: Array<Promise<void>> = new Array<Promise<void>>();

            promises.push(
                redisClient.SetKeyValueBuffered(sessionUser.Id, redisEntry)
            );
            promises.push(
                redisClient.SetKeyValueBuffered(sessionUser.Email, redisEntry)
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
