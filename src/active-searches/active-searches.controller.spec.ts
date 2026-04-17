import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import appDatasource from 'src/app.datasource';
import { ActiveSearchesController } from './active-searches.controller';
import { ActiveSearchesService } from './active-searches.service';
import { ActiveSearch } from './entities/active-search.entity';

describe('ActiveSearchesController', () => {
  let controller: ActiveSearchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([ActiveSearch]),
        AccountsModule,
      ],
      controllers: [ActiveSearchesController],
      providers: [ActiveSearchesService],
    }).compile();

    controller = module.get<ActiveSearchesController>(ActiveSearchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
