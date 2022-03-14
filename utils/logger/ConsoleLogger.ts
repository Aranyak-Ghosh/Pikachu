import { LogLevel } from "types/Log";
import { ILogger } from "./interface/ILogger";

class ConsoleLogger extends ILogger {
    public Log(severity: LogLevel, message: string, ...args: any[]): void {
        console.log("Severity: " + severity);
        console.log(message, args);
    }
    public Trace(message: string, ...args: any[]): void {
        console.trace(message, args);
    }
    public Debug(message: string, ...args: any[]): void {
        console.debug(message, args);
    }
    public Info(message: string, ...args: any[]): void {
        console.info(message, args);
    }
    public Warn(message: string, ...args: any[]): void {
        console.warn(message, args);
    }
    public Error(message: string, ...args: any[]): void {
        console.error(message, args);
    }

    public static GetInstance(): ILogger {
        return new ConsoleLogger();
    }
}

export default ConsoleLogger;
