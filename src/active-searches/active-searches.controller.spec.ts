import { Test, TestingModule } from '@nestjs/testing';
import { ActiveSearchesController } from './active-searches.controller';
import { ActiveSearchesService } from './active-searches.service';

describe('ActiveSearchesController', () => {
  let controller: ActiveSearchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveSearchesController],
      providers: [ActiveSearchesService],
    }).compile();

    controller = module.get<ActiveSearchesController>(ActiveSearchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
