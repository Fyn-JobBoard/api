import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveSearchesController } from './active-searches.controller';
import { ActiveSearchesService } from './active-searches.service';
import { ActiveSearch } from './entities/active-search.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActiveSearch])],
  controllers: [ActiveSearchesController],
  providers: [ActiveSearchesService],
  exports: [ActiveSearchesModule],
})
export class ActiveSearchesModule {}
