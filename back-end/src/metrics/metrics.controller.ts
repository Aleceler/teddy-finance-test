import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { metricsRegistry } from './metrics.registry';

@ApiTags('metrics')
@Controller()
export class MetricsController {
  @Get('metrics')
  @ApiOperation({
    summary: 'Prometheus metrics exposition',
    description:
      'Returns process and HTTP metrics in Prometheus exposition format.',
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Prometheus metrics payload',
    schema: {
      type: 'string',
      example:
        '# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter',
    },
  })
  async getMetrics(@Res() response: Response) {
    response.set('Content-Type', metricsRegistry.contentType);
    response.send(await metricsRegistry.metrics());
  }
}
