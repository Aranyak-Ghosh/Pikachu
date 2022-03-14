"use strict";
import { AGServerSocket } from "socketcluster-server";

interface UserSocket {
    UserID: string;
    SessionID: string;
    Socket: AGServerSocket;
}

export type { UserSocket };
