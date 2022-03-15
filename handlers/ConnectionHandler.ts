"use strict";

import { AGServerSocket } from "socketcluster-server";
import { TokenClaims } from "../types/Claims";
import TokenParser from "../utils/auth/TokenParser";
import { ILogger } from "../utils/logger/interface/ILogger";
import { SessionUser } from "../types/SocketConnection";
import { UserState, UserType } from "../types/RedisEntries";
import SocketService from "../services/SocketService";

async function onClientConnectedHandler(
    socket: AGServerSocket,
    logger: ILogger
) {
    for await (let request of socket.procedure("login")) {
        if (request && request.data && request.data.token) {
            let claims = handleLogin(request.data.token, logger);
            if (claims != null) {
                let authenticatedUser: SessionUser;
                authenticatedUser = {
                    Id: claims.user_id,
                    Email: claims.user_email,
                    HearingIds: claims.hearing_id,
                    SessionIds: claims.session_id,
                    FirstName: claims.given_name,
                    LastName: claims.family_name,
                    State: UserState.InLobby,
                    Type:
                        claims.type == "LSU"
                            ? UserType.LiveStreamUser
                            : claims.type == "Guest"
                            ? UserType.Guest
                            : UserType.SessionUser,
                };

                let service: SocketService = SocketService.GetInstance();
                await service.RegisterUserSocket(socket, authenticatedUser);
                //TODO: Queue Presense notification
                request.end();
                socket.setAuthToken(authenticatedUser);
            } else {
                let loginError = new Error("Failed to authenticate user");
                loginError.name = "AuthenticationFailedError";
                request.error(loginError);
            }
        }
    }
}

function handleLogin(token: string, logger: ILogger): TokenClaims | null {
    try {
        let claims = TokenParser.ValidateToken(token);
        return claims;
    } catch (ex) {
        logger.Error("Failed to authenticate user", ex);
        return null;
    }
}

export default onClientConnectedHandler;
