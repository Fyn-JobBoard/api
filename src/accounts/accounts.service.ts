import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { hash } from 'bcrypt';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Raw, Repository } from 'typeorm';
import { CreateAdministratorDto } from './dto/administrators/create-administrator.dto';
import { CreateCompanyDto } from './dto/companies/create-company.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateManagedDto } from './dto/managed/create-managed.dto';
import { CreateStudentDto } from './dto/students/create-student.dto';
import { Account, AccountModel } from './entities/account.entity';
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

  protected getRelatedModelOf(type: AccountTypes): AccountModel {
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

    assert(model, `Cannot find model's type from account type ${type}.`);
    return model;
  }
  protected getRepositoryOf<Model extends AccountModel>(
    model: Model,
  ): Repository<InstanceType<Model>> {
    //@ts-expect-error Typescript just can't understand that apparently. If not used, it takes only the Administrator entity type.
    return new Repository(model, this.accounts.manager);
  }

  public async find(id: string) {
    return this.accounts.findOneBy({
      id: Raw((alias) => `(${alias})::text = :id`, { id }),
    });
  }
  public async findModel<Model extends AccountModel>(
    id: string,
    model: Model,
  ): Promise<InstanceType<Model> | null> {
    //@ts-expect-error TSame issue as the "getRepositoryOf" method. The id property is present on all AccountModels.
    return this.getRepositoryOf(model).findOneBy({
      id: Raw((alias) => `(${alias})::text = :id`, { id }),
    });
  }

  /**
   * Retreive the associed account type
   */
  public async getModelOf(
    account: Account,
  ): Promise<Student | Managed | Company | Administrator> {
    return this.getRepositoryOf(
      this.getRelatedModelOf(account.type),
    ).findOneByOrFail({ id: account.id });
  }

  /**
   * Create an account with type based on the provided DTO
   * todo -> Password hashing
   */
  public async create(
    account: CreateAccountDto,
    dto:
      | CreateStudentDto
      | CreateAdministratorDto
      | CreateCompanyDto
      | CreateManagedDto,
  ) {
    const type =
      dto instanceof CreateStudentDto
        ? AccountTypes.Student
        : dto instanceof CreateAdministratorDto
          ? AccountTypes.Admin
          : dto instanceof CreateCompanyDto
            ? AccountTypes.Company
            : dto instanceof CreateManagedDto
              ? AccountTypes.Managed
              : null;
    assert(type);

    const insertion = await this.accounts.insert({
      ...account,
      password: await hash(account.password, process.env.BCRYPT_SALT ?? 10),
      type,
    });

    const created = await this.accounts.findOneByOrFail({
      id: insertion.identifiers[0].id as string,
    });

    const repository = this.getRepositoryOf(this.getRelatedModelOf(type));
    await repository.insert({
      id: created.id,
      ...dto,
    });

    return this.getModelOf(created);
  }

  public async delete(account: Account | string) {
    const account_id = typeof account === 'string' ? account : account.id;
    await this.accounts.delete(account_id);
  }

  public async bulkDelete(account_ids: string[]) {
    await this.accounts.delete(account_ids);
  }
}
