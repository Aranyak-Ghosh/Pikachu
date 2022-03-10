interface WSEngineOptions {
    maxPayload: number;
  }
  
  interface SocketServerOptions {
    /**
     * The port to listen on.
     * @default 8000
     */
    port: number;
    /**
     * Declares the engine to use for WebSocket connections.
     * @default 'ws'
     */
    wsEngine: string;
    serverName: string;
    wsEngineOptions: WSEngineOptions;
    /**
     * Timeout for the handshake to complete.
     * @default 10000
     */
    handshakeTimeout: number;
    /**
     * Timeout for a ping to complete.
     * @default 20000
     */
    pingTimeout: number;
    /**
     * Timeout for an ACK to complete.
     * @default 10000
     */
    ackTimeout: number;
    /**
     * Interval for sending pings.
     * @default 8000
     */
    pingInterval: number;
    /**
     * URL of the database to connect to.
     * @default "redis://localhost:6379"
     */
    databaseURL: string;
    /**
     * IP of socket server instance.
     * @default "localhost"
     */
    messageBrokerURL: string;
    /**
     * IP of message broker.
     * @default "http://localhost:3199"
     */
    serverHost: string;
    /**
     * Port of socket server instance.
     * @default 8080
     */
    serverPort: number;
  }
  
  export { WSEngineOptions, SocketServerOptions };
  