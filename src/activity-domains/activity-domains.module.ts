import { Module } from '@nestjs/common';
import { ActivityDomainsService } from './activity-domains.service';
import { ActivityDomainsController } from './activity-domains.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityDomain } from './entities/activity-domain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityDomain])],
  controllers: [ActivityDomainsController],
  providers: [ActivityDomainsService],
  exports: [ActivityDomainsService],
})
export class ActivityDomainsModule {}
