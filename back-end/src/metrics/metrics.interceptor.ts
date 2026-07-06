import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { type Observable, tap } from 'rxjs';
import {
  httpRequestDurationSeconds,
  httpRequestsTotal,
} from './metrics.registry';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const route = this.resolveRoute(request);
    const startedAt = process.hrtime.bigint();

    return next.handle().pipe(
      tap({
        next: () => {
          this.recordMetrics(request.method, route, response.statusCode, startedAt);
        },
        error: (error: unknown) => {
          const statusCode =
            error instanceof HttpException ? error.getStatus() : 500;
          this.recordMetrics(request.method, route, statusCode, startedAt);
        },
      }),
    );
  }

  private resolveRoute(request: Request): string {
    if (request.route?.path) {
      return request.baseUrl
        ? `${request.baseUrl}${request.route.path}`
        : request.route.path;
    }

    return request.path;
  }

  private recordMetrics(
    method: string,
    route: string,
    statusCode: number,
    startedAt: bigint,
  ) {
    const labels = {
      method,
      route,
      status_code: String(statusCode),
    };

    httpRequestsTotal.inc(labels);

    const durationSeconds =
      Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;

    httpRequestDurationSeconds.observe(labels, durationSeconds);
  }
}
