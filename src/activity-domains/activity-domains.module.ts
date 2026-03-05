import { Module } from '@nestjs/common';
import { ActivityDomainsService } from './activity-domains.service';
import { ActivityDomainsController } from './activity-domains.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityDomain } from './entities/activity-domain.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
@Module({
  imports: [TypeOrmModule.forFeature([ActivityDomain]), AccountsModule],
  controllers: [ActivityDomainsController],
  providers: [ActivityDomainsService, IsLoggedGuard],
  exports: [ActivityDomainsService],
})
export class ActivityDomainsModule {}
