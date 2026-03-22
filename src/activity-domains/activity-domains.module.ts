import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { ActivityDomainsController } from './activity-domains.controller';
import { ActivityDomainsService } from './activity-domains.service';
import { ActivityDomain } from './entities/activity-domain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityDomain]), AccountsModule],
  controllers: [ActivityDomainsController],
  providers: [ActivityDomainsService, IsLoggedGuard],
  exports: [ActivityDomainsService],
})
export class ActivityDomainsModule {}
