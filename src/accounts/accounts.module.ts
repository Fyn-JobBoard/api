import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { CompaniesController } from './companies.controller';
import { Account } from './entities/account.entity';
import { Administrator } from './entities/admin.entity';
import { Company } from './entities/company.entity';
import { Managed } from './entities/managed.entity';
import { Student } from './entities/student.entity';
import { ManagedController } from './managed.controller';
import { StudentsController } from './students.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Student,
      Company,
      Managed,
      Administrator,
    ]),
  ],
  controllers: [
    AccountsController,
    StudentsController,
    CompaniesController,
    ManagedController,
  ],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
