import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import appDatasource from 'src/app.datasource';
import { Formation } from './entities/formation.entity';
import { FormationsService } from './formations.service';

describe('FormationsService', () => {
  let service: FormationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([Formation, Account]),
      ],
      providers: [FormationsService, AccountsService],
    }).compile();

    service = module.get<FormationsService>(FormationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
