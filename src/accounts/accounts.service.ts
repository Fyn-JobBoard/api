import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { hash } from 'bcrypt';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { type FindOptionsWhere, Raw, Repository } from 'typeorm';
import { CreateAdministratorDto } from './dto/administrators/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/administrators/update-administrator.dto';
import { CreateCompanyDto } from './dto/companies/create-company.dto';
import { UpdateCompanyDto } from './dto/companies/update-company.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateManagedDto } from './dto/managed/create-managed.dto';
import { UpdateManagedDto } from './dto/managed/update-managed.dto';
import { CreateStudentDto } from './dto/students/create-student.dto';
import { UpdateStudentDto } from './dto/students/update-student.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
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
  public getModelOf(
    account: Account,
  ): Promise<Student | Managed | Company | Administrator> {
    return this.getRepositoryOf(
      this.getRelatedModelOf(account.type),
    ).findOneByOrFail({ id: account.id });
  }

  /**
   * Create an account with type based on the provided DTO
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

  public async update(
    account: Account | string,
    update:
      | UpdateAccountDto
      | UpdateStudentDto
      | UpdateAdministratorDto
      | UpdateManagedDto
      | UpdateCompanyDto,
  ) {
    const type =
      update instanceof UpdateStudentDto
        ? AccountTypes.Student
        : update instanceof UpdateAdministratorDto
          ? AccountTypes.Admin
          : update instanceof UpdateCompanyDto
            ? AccountTypes.Company
            : update instanceof UpdateManagedDto
              ? AccountTypes.Managed
              : null;

    const account_id = account instanceof Account ? account.id : account;
    const wrongUpdateDtoException = new BadRequestException(
      'Tried to update account without the right update DTO.',
    );
    if (type === null) {
      if (!(update instanceof UpdateAccountDto)) {
        return wrongUpdateDtoException;
      }

      const found = await this.find(account_id);
      if (!found) {
        return new NotFoundException();
      }

      delete update.admin;
      delete update.company;
      delete update.managed;
      delete update.student;
      Object.assign(found, update);

      return this.accounts.save(found);
    }

    const model = this.getRelatedModelOf(type);
    const found = await this.findModel(account_id, model);
    if (!found) {
      return new NotFoundException();
    }

    switch (type) {
      case AccountTypes.Admin: {
        if (!(update instanceof UpdateAdministratorDto)) {
          return wrongUpdateDtoException;
        }
        break;
      }
      case AccountTypes.Company: {
        if (!(update instanceof UpdateCompanyDto)) {
          return wrongUpdateDtoException;
        }
        break;
      }
      case AccountTypes.Managed: {
        if (!(update instanceof UpdateManagedDto)) {
          return wrongUpdateDtoException;
        }
        break;
      }
      case AccountTypes.Student: {
        if (!(update instanceof UpdateStudentDto)) {
          return wrongUpdateDtoException;
        }
        break;
      }
    }

    Object.assign(found, update);
    return this.getRepositoryOf(model).save(found);
  }

  public async delete(account: Account | string) {
    const account_id = typeof account === 'string' ? account : account.id;
    await this.accounts.delete(account_id);
  }

  public async bulkDelete(account_ids: string[]) {
    await this.accounts.delete(account_ids);
  }

  public async list(
    page: number = 1,
    per_page?: number,
    where?: FindOptionsWhere<Account>,
  ) {
    if (per_page === undefined) {
      return {
        page: 1,
        pages: 1,
        list: await this.accounts.find({
          where,
        }),
      };
    }
    const amount = await this.accounts.count();
    return {
      page,
      pages: Math.ceil(amount / per_page),
      list: await this.accounts.find({
        skip: per_page * (page - 1),
        take: per_page,
        where,
      }),
    };
  }

  public async listOf<Model extends AccountModel>(
    type: Model,
    page: number = 1,
    per_page?: number,
    where?: FindOptionsWhere<InstanceType<Model>>,
  ) {
    const repository = this.getRepositoryOf<Model>(type);

    if (per_page === undefined) {
      return {
        page: 1,
        pages: 1,
        list: await repository.find({
          where,
        }),
      };
    }
    const amount = await this.accounts.count();
    return {
      page,
      pages: Math.ceil(amount / per_page),
      list: await repository.find({
        skip: (per_page ?? 0) * (page - 1),
        take: per_page,
        where,
      }),
    };
  }
}
