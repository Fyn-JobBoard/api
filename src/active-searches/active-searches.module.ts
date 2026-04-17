import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { ActiveSearchesController } from './active-searches.controller';
import { ActiveSearchesService } from './active-searches.service';
import { ActiveSearch } from './entities/active-search.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActiveSearch]), AccountsModule],
  controllers: [ActiveSearchesController],
  providers: [ActiveSearchesService],
  exports: [ActiveSearchesService],
})
export class ActiveSearchesModule {}
