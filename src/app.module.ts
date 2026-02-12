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
import { SkillsModule } from './skills/skills.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { FormationsModule } from './formations/formations.module';
import { ApplicationsModule } from './applications/applications.module';
import { ActiveSearchesModule } from './active-searches/active-searches.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(appDatasource.options),
    AccountsModule,
    StudentsModule,
    TagsModule,
    JobsModule,
    ActivityDomainsModule,
    SkillsModule,
    ExperiencesModule,
    FormationsModule,
    ApplicationsModule,
    ActiveSearchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
