import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Account } from 'src/accounts/entities/account.entity';
import { Experience } from './entities/experience.entity';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, Account]), AccountsModule],
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
  exports: [ExperiencesModule],
})
export class ExperiencesModule {}
