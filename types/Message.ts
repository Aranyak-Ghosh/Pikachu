'use strict';
// Template Interface for RPC Message
// Language: typescript
// Description: Message sent to invoke RPC
interface RPCMessage<T> {
    Audience: string[];
    AdditionalData: T;
}

interface AuthRequestMessage {

}

// Template Interface for Socket Message
// Language: typescript
// Description: Message sent to 
interface SocketMessage {
    SocketIDs: string[];
    Type: string;
    Data?: any;
    TransactionID: string;
}

// Template Interface for RPC Message
// Language: typescript
// Description: Message sent to invoke RPC
interface BrokerMessage<T> {
    RecipientIDs: string[];
    Type: string;
    Data?: T;
    TransactionID: string;
}
