import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import appDatasource from 'src/app.datasource';
import { AuthModule } from 'src/auth/auth.module';
import { AccountsService } from './accounts.service';
import { CompaniesController } from './companies.controller';
import { Account } from './entities/account.entity';

describe('CompaniesController', () => {
  let controller: CompaniesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([Account]),
      ],
      controllers: [CompaniesController],
      providers: [AccountsService],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
