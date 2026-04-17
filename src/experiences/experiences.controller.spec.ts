import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import appDatasource from 'src/app.datasource';
import { Experience } from './entities/experience.entity';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';

describe('ExperiencesController', () => {
  let controller: ExperiencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([Experience, Account]),
      ],
      controllers: [ExperiencesController],
      providers: [ExperiencesService, AccountsService],
    }).compile();

    controller = module.get<ExperiencesController>(ExperiencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
