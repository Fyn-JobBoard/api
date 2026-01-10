import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { Account } from './accounts.entity';
import { AccountsService } from './accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService, TypeOrmModule],
})
export class AccountsModule {}
