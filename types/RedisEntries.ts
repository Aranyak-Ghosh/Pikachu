"use strict";

enum UserType {
  SessionUser = "SessionUser",
  Guest = "Guest",
  LiveStreamUser = "LiveStreamUser",
  Session = "session",
  Hearing = "hearing",
  User = "user",
}

enum UserState {
  InLobby = "InLobby",
  InSession = "InSession",
  InHearing = "InHearing",
}

interface RedisUserEntry {
  SocketId: string;
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

export { UserType, UserState };
export type { RedisUserEntry };
