import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { ActivityDomainsModule } from './activity-domains/activity-domains.module';
import { JobsModule } from './jobs/jobs.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [TagsModule, JobsModule, ActivityDomainsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
