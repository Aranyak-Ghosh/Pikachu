class ClientNotInitializedError extends Error {
    constructor(){
        super("Client not initialized")
        this.name = "ClientNotInitializedError"
    }
}

export {ClientNotInitializedError}