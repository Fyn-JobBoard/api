import { Test, TestingModule } from '@nestjs/testing';
import { ActivityDomainsController } from './activity-domains.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import appDatasource from 'src/app.datasource';
import { ActivityDomainsModule } from './activity-domains.module';

describe('ActivityDomainsController', () => {
  let controller: ActivityDomainsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        ActivityDomainsModule,
      ],
    }).compile();

    controller = module.get<ActivityDomainsController>(
      ActivityDomainsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
