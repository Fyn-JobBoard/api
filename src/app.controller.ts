import { Controller, Get, Query, Req, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { type Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Version('1')
  @ApiOperation({
    description: 'Ping the application and get some informations about it',
  })
  @ApiQuery({
    name: 'only',
    required: false,
    description: 'Provide the key you only want to return',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        uptime: {
          type: 'integer',
          minimum: 0,
          description: 'The uptime of the API (in ms)',
        },
        version: {
          type: 'string',
          format: 'version',
          description: 'The version of the API project',
        },
        client_ip: {
          type: 'string',
          format: 'ip',
          description: 'Your IP',
        },
        api_version: {
          type: 'integer',
          minimum: 1,
          description: 'The latest api version',
        },
      },
      required: ['uptime', 'version', 'api_version'],
    },
  })
  getPing(
    @Req()
    request: Request,
    @Query('only')
    only?: string,
  ) {
    const ping = this.appService.getPing(request);
    if (only && only in ping) {
      return ping[only] as unknown;
    }
    return ping;
  }
}
