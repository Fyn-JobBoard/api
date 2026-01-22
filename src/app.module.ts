import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { ActivityDomainsModule } from './activity-domains/activity-domains.module';
import { AppController } from './app.controller';
import appDatasource from './app.datasource';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { StudentsModule } from './students/students.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(appDatasource.options),
    AccountsModule,
    StudentsModule,
    TagsModule,
    JobsModule,
    ActivityDomainsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
