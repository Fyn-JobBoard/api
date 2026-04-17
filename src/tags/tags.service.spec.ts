import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import appDatasource from 'src/app.datasource';
import { TagsModule } from './tags.module';

describe('TagsService', () => {
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(appDatasource.options), TagsModule],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
