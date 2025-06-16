import { Injectable, Logger, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
  private logger = new Logger('AppLogger');
  private activeLevel: Array<LogLevel>;
  private readonly logFilePath = path.resolve(__dirname, '../../logs/app.log');
  private readonly errorFilePath = path.resolve(
    __dirname,
    '../../logs/error.log',
  );
  private readonly maxSizeKb = parseInt(
    process.env.LOG_MAX_FILE_SIZE || '100',
    10,
  );

  constructor() {
    this.ensureLogDir();
    this.activeLevel = this.getLogLevels();
  }

  private ensureLogDir() {
    const dir = path.resolve(__dirname, '../../logs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private getLogLevels(): Array<LogLevel> {
    const levelNumber = parseInt(process.env.LOG_LVL || '2', 10);
    const allLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
    if (isNaN(levelNumber) || levelNumber < 0 || levelNumber > 4) {
      return ['log'];
    }
    return allLevels.slice(0, levelNumber + 1);
  }

  private shouldRotate(filePath: string): boolean {
    if (!fs.existsSync(filePath)) return false;
    const stats = fs.statSync(filePath);
    const sizeInKb = stats.size / 1024;
    return sizeInKb > this.maxSizeKb;
  }

  private rotateFile(filePath: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rotatedName = filePath.replace('.log', `-${timestamp}.log`);
    fs.renameSync(filePath, rotatedName);
  }

  private writeToFile(message: string, isError = false) {
    const filePath = isError ? this.errorFilePath : this.logFilePath;

    if (this.shouldRotate(filePath)) {
      this.rotateFile(filePath);
    }

    fs.appendFileSync(filePath, message + '\n');
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }

  log(message: string) {
    if (this.activeLevel.includes('log')) {
      this.logger.log(message);
      this.writeToFile(this.formatMessage('log', message));
    }
  }

  error(message: string, trace?: string) {
    if (this.activeLevel.includes('error')) {
      this.logger.error(message, trace);
      const formatted = this.formatMessage(
        'error',
        message + (trace ? `\n${trace}` : ''),
      );
      this.writeToFile(formatted);
      this.writeToFile(formatted, true);
    }
  }

  warn(message: string) {
    if (this.activeLevel.includes('warn')) {
      this.logger.warn(message);
      this.writeToFile(this.formatMessage('warn', message));
    }
  }

  debug(message: string) {
    if (this.activeLevel.includes('debug')) {
      this.logger.debug(message);
      this.writeToFile(this.formatMessage('debug', message));
    }
  }

  verbose(message: string) {
    if (this.activeLevel.includes('verbose')) {
      this.logger.verbose(message);
      this.writeToFile(this.formatMessage('verbose', message));
    }
  }
}
