import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Job } from 'src/jobs/entities/job.entity';
import { Student } from 'src/accounts/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Job, Student]),
    AccountsModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
