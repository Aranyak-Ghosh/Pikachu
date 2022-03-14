"use strict";

import { AGServerSocket } from "socketcluster-server";
import { SocketServerOptions } from "../types/SocketServerOptions";

async function onClientConnectedHandler(
    socket: AGServerSocket,
    serverOptions: SocketServerOptions
) {
    for await (let request of socket.procedure("login")) {
    }
}
