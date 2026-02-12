import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { Administrator } from './entities/admin.entity';
import { Company } from './entities/company.entity';
import { Managed } from './entities/managed.entity';
import { Student } from './entities/student.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>,
  ) {}

  /**
   * Retreive the associed account type
   */
  public async getModelOf(
    account: Account,
  ): Promise<Student | Managed | Company | Administrator> {
    const { type } = account;

    const model =
      type === AccountTypes.Admin
        ? Administrator
        : type === AccountTypes.Managed
          ? Managed
          : type === AccountTypes.Company
            ? Company
            : type === AccountTypes.Student
              ? Student
              : null;
    assert(
      model,
      `Cannot find model's type from account type ${type} (on account '${account.id}').`,
    );

    const modelRepository = new Repository(model, this.accounts.manager);
    return modelRepository.findOneByOrFail({ id: account.id });
  }
}
