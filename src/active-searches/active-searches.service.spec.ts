import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import appDatasource from 'src/app.datasource';
import { ActiveSearchesService } from './active-searches.service';
import { ActiveSearch } from './entities/active-search.entity';

describe('ActiveSearchesService', () => {
  let service: ActiveSearchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([ActiveSearch]),
        AccountsModule,
      ],
      providers: [ActiveSearchesService],
    }).compile();

    service = module.get<ActiveSearchesService>(ActiveSearchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
