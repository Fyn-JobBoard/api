import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { Experience } from './entities/experience.entity';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, Account])],
  controllers: [ExperiencesController],
  providers: [ExperiencesService, AccountsService],
  exports: [ExperiencesModule],
})
export class ExperiencesModule {}
