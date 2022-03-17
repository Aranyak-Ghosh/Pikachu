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
    Command: string;
    Data?: any;
}

// Template Interface for RPC Message
// Language: typescript
// Description: Message sent to invoke RPC
interface BrokerMessage {
    Audience: string[];
    Command: string;
    Data?: any;
}
