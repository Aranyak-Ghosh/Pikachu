class ClientNotInitializedError extends Error {
    constructor(ClientType: string){
        super(ClientType + " Client not initialized")
        this.name = "ClientNotInitializedError"
    }
}

export {ClientNotInitializedError}