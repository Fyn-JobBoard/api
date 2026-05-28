import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Account } from 'src/accounts/entities/account.entity';
import { Formation } from './entities/formation.entity';
import { FormationsController } from './formations.controller';
import { FormationsService } from './formations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Formation, Account]), AccountsModule],
  controllers: [FormationsController],
  providers: [FormationsService],
  exports: [FormationsModule],
})
export class FormationsModule {}
