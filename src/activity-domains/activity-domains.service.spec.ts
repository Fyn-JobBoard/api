import { Test, TestingModule } from '@nestjs/testing';
import { ActivityDomainsService } from './activity-domains.service';

describe('ActivityDomainsService', () => {
  let service: ActivityDomainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityDomainsService],
    }).compile();

    service = module.get<ActivityDomainsService>(ActivityDomainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
