import { Injectable, Logger, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private logger = new Logger('AppLogger');
  private activeLevel: Array<LogLevel>;

  constructor() {
    this.activeLevel = this.getLogLevels();
  }

  private getLogLevels(): Array<LogLevel> {
    console.log(process.env, 'process.env');
    console.log(process.env.LOG_LVL, 'process.env.LOG_LVL');
    const levelNumber = parseInt(process.env.LOG_LVL || '2', 10);
    const allLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
    if (isNaN(levelNumber) || levelNumber < 0 || levelNumber > 4) {
      return ['log'];
    }
    return allLevels.slice(0, levelNumber + 1);
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
