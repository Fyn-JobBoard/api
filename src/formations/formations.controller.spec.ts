import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import appDatasource from 'src/app.datasource';
import { ExistsConstraint } from 'src/common/validators/exists/exists.constraint';
import { Formation } from './entities/formation.entity';
import { FormationsController } from './formations.controller';
import { FormationsService } from './formations.service';

describe('FormationsController', () => {
  let controller: FormationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([Formation, Account]),
      ],
      controllers: [FormationsController],
      providers: [FormationsService, AccountsService, ExistsConstraint],
    }).compile();

    controller = module.get<FormationsController>(FormationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
