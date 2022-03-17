"use strict";
// Template Interface for RPC Message
// Language: typescript
// Description: Message sent to invoke RPC
interface RPCMessage<T> {
    Audience: string[];
    AdditionalData: T;
}

interface AuthRequestMessage {}

// Template Interface for Socket Message
// Language: typescript
// Description: Message sent to
interface SocketMessage {
    command: string;
    data?: any;
}

// Template Interface for RPC Message
// Language: typescript
// Description: Message sent to invoke RPC
interface BrokerMessage {
    audience: string[];
    command: string;
    data?: any;
}
