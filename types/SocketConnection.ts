"use strict";

import { UserState, UserType } from "./RedisEntries";

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

export type { SessionUser };
