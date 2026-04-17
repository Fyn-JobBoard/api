import { Test, TestingModule } from '@nestjs/testing';
import { ActivityDomainsService } from './activity-domains.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import appDatasource from 'src/app.datasource';
import { ActivityDomainsModule } from './activity-domains.module';

describe('ActivityDomainsService', () => {
  let service: ActivityDomainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        ActivityDomainsModule,
      ],
    }).compile();

    service = module.get<ActivityDomainsService>(ActivityDomainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
