import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), AccountsModule],
  controllers: [TagsController],
  providers: [TagsService, IsLoggedGuard],
  exports: [TagsService],
})
export class TagsModule {}
