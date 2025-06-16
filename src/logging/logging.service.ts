import { Injectable, Logger, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private logger = new Logger('AppLogger');
  private activeLevel: Array<LogLevel>;

  constructor() {
    this.activeLevel = this.getLogLevels();
  }

  private getLogLevels(): Array<LogLevel> {
    const level = process.env.LOG_LVL || 'log';
    const levels: Array<LogLevel> = [
      'error',
      'warn',
      'log',
      'debug',
      'verbose',
    ];
    const index = levels.lastIndexOf(level as LogLevel);
    return index !== -1 ? levels.slice(0, index + 1) : ['log'];
  }

  log(message: string) {
    if (this.activeLevel.includes('log')) {
      this.logger.log(message);
    }
  }

  error(message: string, trace?: string) {
    if (this.activeLevel.includes('log')) {
      this.logger.error(message, trace);
    }
  }

  warn(message: string) {
    if (this.activeLevel.includes('warn')) {
      this.logger.warn(message);
    }
  }

  debug(message: string) {
    if (this.activeLevel.includes('debug')) {
      this.logger.debug(message);
    }
  }

  verbose(message: string) {
    if (this.activeLevel.includes('verbose')) {
      this.logger.debug(message);
    }
  }
}
