'use strict';
interface LogModel {
    TimeStamp: Date
    AdditionalData?: any
    Severity: string
}

enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error
}

export { LogModel, LogLevel }