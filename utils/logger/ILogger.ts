import { LogLevel } from "../../types/Log"

abstract class ILogger {
    public abstract Log(severity: LogLevel, message: string, ...args: any[]): void
    public abstract Trace(message: string, ...args: any[]): void
    public abstract Debug(message: string, ...args: any[]): void
    public abstract Info(message: string, ...args: any[]): void
    public abstract Warn(message: string, ...args: any[]): void
    public abstract Error(message: string, ...args: any[]): void

    public static GetInstance():ILogger{
        throw new Error("ILogger is an abstract class and can not be initialized")
        return;
    }
}

export { ILogger }