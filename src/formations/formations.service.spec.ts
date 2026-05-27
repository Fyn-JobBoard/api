import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Account } from 'src/accounts/entities/account.entity';
import appDatasource from 'src/app.datasource';
import { Formation } from './entities/formation.entity';
import { FormationsService } from './formations.service';

describe('FormationsService', () => {
  let service: FormationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountsModule,
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([Formation, Account]),
      ],
      providers: [FormationsService],
    }).compile();

    service = module.get<FormationsService>(FormationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
