import { type IncomingMessage, type ServerResponse } from 'node:http';
import { stdSerializers } from 'pino';

interface RequestWithRoute extends IncomingMessage {
  route?: { path?: string };
  originalUrl?: string;
}

export function createPinoHttpConfig(isProduction: boolean) {
  return {
    transport: isProduction
      ? undefined
      : { target: 'pino-pretty', options: { singleLine: true } },
    serializers: {
      req: (request: RequestWithRoute) => ({
        method: request.method,
        url: request.url,
        route: request.route?.path ?? request.originalUrl ?? request.url,
        remoteAddress: request.socket?.remoteAddress,
      }),
      res: (response: ServerResponse) => ({
        statusCode: response.statusCode,
      }),
      err: stdSerializers.err,
    },
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
      responseTime: 'duration',
    },
    customProps: (
      request: RequestWithRoute,
      response: ServerResponse,
      error?: Error,
    ) => {
      const props: Record<string, unknown> = {
        request: {
          method: request.method,
          url: request.url,
          route: request.route?.path ?? request.originalUrl ?? request.url,
        },
        response: {
          statusCode: response.statusCode,
        },
        statusCode: response.statusCode,
      };

      if (error) {
        props.error = {
          message: error.message,
          name: error.name,
          stack: error.stack,
        };
      }

      return props;
    },
    customSuccessMessage: (
      request: RequestWithRoute,
      response: ServerResponse,
    ) =>
      `${request.method} ${request.route?.path ?? request.url} ${response.statusCode}`,
    customErrorMessage: (
      request: RequestWithRoute,
      response: ServerResponse,
      error: Error,
    ) =>
      `${request.method} ${request.route?.path ?? request.url} ${response.statusCode} - ${error.message}`,
  };
}
