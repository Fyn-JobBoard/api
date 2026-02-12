import { Test, TestingModule } from '@nestjs/testing';
import { ActiveSearchesService } from './active-searches.service';

describe('ActiveSearchesService', () => {
  let service: ActiveSearchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveSearchesService],
    }).compile();

    service = module.get<ActiveSearchesService>(ActiveSearchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
