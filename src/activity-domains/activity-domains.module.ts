import { Module } from '@nestjs/common';
import { ActivityDomainsService } from './activity-domains.service';
import { ActivityDomainsController } from './activity-domains.controller';

@Module({
  controllers: [ActivityDomainsController],
  providers: [ActivityDomainsService],
})
export class ActivityDomainsModule {}
