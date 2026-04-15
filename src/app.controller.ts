import { Controller, Get, Query, Req, Version } from '@nestjs/common';
import { type Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Version('1')
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
