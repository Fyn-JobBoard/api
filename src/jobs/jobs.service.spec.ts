import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import appDatasource from 'src/app.datasource';
import { JobsModule } from './jobs.module';

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(appDatasource.options), JobsModule],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
