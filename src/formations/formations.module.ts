import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { Formation } from './entities/formation.entity';
import { FormationsController } from './formations.controller';
import { FormationsService } from './formations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Formation, Account])],
  controllers: [FormationsController],
  providers: [FormationsService, AccountsService],
  exports: [FormationsModule],
})
export class FormationsModule {}
