import { Injectable } from '@nestjs/common';
import { type Request } from 'express';
import * as project from '../package.json';

@Injectable()
export class AppService {
  getPing(request?: Request) {
    return {
      uptime: Math.floor(process.uptime() * 1e3),
      version: project.version,
      client_ip: request?.ip,
      api_version: 1,
    };
  }
}
