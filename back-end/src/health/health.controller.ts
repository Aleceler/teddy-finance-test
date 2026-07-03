import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('healthz')
  @ApiOperation({ summary: 'Application health check' })
  check() {
    return { status: 'ok' };
  }
}
