import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import appDatasource from 'src/app.datasource';
import { Experience } from './entities/experience.entity';
import { ExperiencesService } from './experiences.service';

describe('ExperiencesService', () => {
  let service: ExperiencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([Experience, Account]),
      ],
      providers: [ExperiencesService, AccountsService],
    }).compile();

    service = module.get<ExperiencesService>(ExperiencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
