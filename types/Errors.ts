class ClientNotInitializedError extends Error {
    constructor(ClientType: string){
        super(ClientType + " Client not initialized")
        this.name = ClientNotInitializedError.name
    }
}


class RedisPublishError extends Error {
    constructor(){
        super("Failed to publish error")
        this.name = RedisPublishError.name
    }
}

export {ClientNotInitializedError}