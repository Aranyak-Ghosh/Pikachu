"use strict";

enum UserType {
    SessionUser = "SessionUser",
    Guest = "Guest",
}

enum UserState {
    InLobby = "InLobby",
    InSession = "InSession",
    InHearing = "InHearing",
}

interface RedisUserEntry {
    Type: UserType;
    Id: string;
    Sessions: Array<string>;
    Hearings: Array<string>;
    State: UserState;
    Email: string;
    ServerInstance: string;
    FirstName: string;
    LastName: string;
}

export type { UserType, UserState, RedisUserEntry };
