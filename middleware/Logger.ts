import * as winston from 'winston'
import { KoaContext } from '../types'

enum LogLevel {
  Debug = 'debug',
  Verbose = 'notice',
  Info = 'info',
  Warn = 'warning',
  Error = 'error',
}

interface LoggerMessage {
  startTimeStamp: number
  duration: number
  routeName: string
  message: string
  level: LogLevel
  method: string
}

interface IWinstonLogger {
  log(LogMessage: LoggerMessage): void
}

class WinstonLogger implements IWinstonLogger {
  public logger: winston.Logger

  public static instance: WinstonLogger | undefined = undefined
  public static getInstance(): WinstonLogger {
    if (this.instance !== undefined) return this.instance
    this.instance = new WinstonLogger(winston)
    return this.instance
  }

  constructor(winstonInstance: typeof winston) {
    this.logger = winstonInstance.createLogger({
      format: winstonInstance.format.json(),
      transports: [
        new winstonInstance.transports.File({
          filename: 'info.txt',
          dirname: 'log',
        }),
      ],
    })
  }

  log = (LogMessage: LoggerMessage) => {
    const { level, ...rest } = LogMessage
    this.logger.log(level, '', rest)
  }
}

export const createWinstonLogger = () => WinstonLogger.getInstance()

const Logger = async (ctx: KoaContext, next: () => Promise<any>) => {
  const startTimeStamp = Date.now()
  try {
    await next()
    const finishTimeStamp = Date.now()
    const duration = finishTimeStamp - startTimeStamp
    createWinstonLogger().log({
      level: LogLevel.Info,
      startTimeStamp,
      duration,
      routeName: ctx.url,
      message: ctx.message,
      method: ctx.method,
    })
  } catch (err) {
    const finishTimeStamp = Date.now()
    const duration = finishTimeStamp - startTimeStamp
    createWinstonLogger().log({
      level: LogLevel.Error,
      startTimeStamp,
      duration,
      routeName: ctx.url,
      message: err?.body?.msg || err?.body?.error?.message,
      method: ctx.method,
    })
    ctx.throw(err)
  }
}

export default Logger
