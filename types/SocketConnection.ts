"use strict";

import { AGServerSocket } from "socketcluster-server";
import { UserState, UserType } from "./RedisEntries";

interface UserSocket {
    Socket: AGServerSocket;
    UserId: string;
}

interface SessionUser {
    Id: string;
    Type: UserType;
    State: UserState;
    Email: string;
    FirstName: string;
    LastName: string;
    SessionIds: Array<string>;
    HearingIds: Array<string>;
}

export type { SessionUser, UserSocket };
