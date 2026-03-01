import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { ActiveSearchesModule } from './active-searches/active-searches.module';
import { ActivityDomainsModule } from './activity-domains/activity-domains.module';
import { AppController } from './app.controller';
import appDatasource from './app.datasource';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications/applications.module';
import { AuthModule } from './auth/auth.module';
import { RequestAccountResolverMiddleware } from './auth/middlewares/request-account-resolver/request-account-resolver.middleware';
import { ExperiencesModule } from './experiences/experiences.module';
import { FormationsModule } from './formations/formations.module';
import { JobsModule } from './jobs/jobs.module';
import { SkillsModule } from './skills/skills.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(appDatasource.options),
    AccountsModule,
    TagsModule,
    JobsModule,
    ActivityDomainsModule,
    SkillsModule,
    ExperiencesModule,
    FormationsModule,
    ApplicationsModule,
    ActiveSearchesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestAccountResolverMiddleware).forRoutes('*');
  }
}
