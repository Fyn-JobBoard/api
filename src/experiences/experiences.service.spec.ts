import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Account } from 'src/accounts/entities/account.entity';
import appDatasource from 'src/app.datasource';
import { Experience } from './entities/experience.entity';
import { ExperiencesService } from './experiences.service';

describe('ExperiencesService', () => {
  let service: ExperiencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountsModule,
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([Experience, Account]),
      ],
      providers: [ExperiencesService],
    }).compile();

    service = module.get<ExperiencesService>(ExperiencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
