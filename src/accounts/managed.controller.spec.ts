import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import appDatasource from 'src/app.datasource';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { ManagedController } from './managed.controller';

describe('ManagedController', () => {
  let controller: ManagedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([Account]),
      ],
      controllers: [ManagedController],
      providers: [AccountsService],
    }).compile();

    controller = module.get<ManagedController>(ManagedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
