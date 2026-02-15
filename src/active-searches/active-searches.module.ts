import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { ActiveSearchesController } from './active-searches.controller';
import { ActiveSearchesService } from './active-searches.service';
import { ActiveSearch } from './entities/active-search.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActiveSearch, Account])],
  controllers: [ActiveSearchesController],
  providers: [ActiveSearchesService, AccountsService],
  exports: [ActiveSearchesModule],
})
export class ActiveSearchesModule {}
