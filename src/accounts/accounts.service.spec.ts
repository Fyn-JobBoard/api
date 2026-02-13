import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import appDatasource from 'src/app.datasource';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateStudentDto } from './dto/students/create-student.dto';
import { Account } from './entities/account.entity';
import { Student } from './entities/student.entity';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(appDatasource.options),
        TypeOrmModule.forFeature([Account]),
      ],
      providers: [AccountsService],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a student account', async () => {
    const student_dto = Object.assign(new CreateStudentDto(), {
      first_name: 'Test',
      last_name: 'User',
      birthdate: new Date('2005-02-22'),
      links: [],
    });
    const account_dto = Object.assign(new CreateAccountDto(), {
      email: 'test@user.fr',
      password: 'abcd1234',
    });

    const created = await service.create(account_dto, student_dto);
    expect(created).toBeInstanceOf(Student);

    await service.delete(created.account);
  });
});
