import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { Response, Request, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, query, body } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `Request: ${method} ${url} | query: ${JSON.stringify(
          query,
        )} | body: ${JSON.stringify(body)} | status: ${res.statusCode} | ${duration}ms`,
      );
    });

    next();
  }
}
