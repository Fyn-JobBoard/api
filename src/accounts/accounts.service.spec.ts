import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import appDatasource from 'src/app.datasource';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateStudentDto } from './dto/students/create-student.dto';
import { Account } from './entities/account.entity';
import { Administrator } from './entities/admin.entity';
import { Company } from './entities/company.entity';
import { Managed } from './entities/managed.entity';
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

  describe('should create account properly', () => {
    let created: Student | Managed | Company | Administrator;
    const PASSWORD = 'abcd1234';
    const student_dto = Object.assign(new CreateStudentDto(), {
      first_name: 'Test',
      last_name: 'User',
      birthdate: new Date('2005-02-22'),
      links: [],
    });
    const account_dto = Object.assign(new CreateAccountDto(), {
      email: 'test@user.fr',
      password: PASSWORD,
    });

    beforeEach(async () => {
      created = await service.create(account_dto, student_dto);
    });

    it('should create a student account', () =>
      expect(created).toBeInstanceOf(Student));

    it('should hash password', () =>
      expect(created.account.password).not.toStrictEqual(PASSWORD));

    afterEach(() => service.delete(created.account));
  });
});
