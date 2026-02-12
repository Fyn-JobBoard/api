import { Module } from '@nestjs/common';
import { ActiveSearchesService } from './active-searches.service';
import { ActiveSearchesController } from './active-searches.controller';

@Module({
  controllers: [ActiveSearchesController],
  providers: [ActiveSearchesService],
})
export class ActiveSearchesModule {}
