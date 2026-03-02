import { ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateAdministratorDto } from './administrators/create-administrator.dto';
import { CreateCompanyDto } from './companies/create-company.dto';
import { CreateManagedDto } from './managed/create-managed.dto';
import { CreateStudentDto } from './students/create-student.dto';

@ApiSchema()
export class CreateAccountDto extends LoginDto {
  @Type(() => CreateStudentDto)
  @ValidateNested()
  student?: CreateStudentDto;

  @Type(() => CreateCompanyDto)
  @ValidateNested()
  company?: CreateCompanyDto;

  @Type(() => CreateManagedDto)
  @ValidateNested()
  managed?: CreateManagedDto;

  @Type(() => CreateAdministratorDto)
  @ValidateNested()
  admin?: CreateAdministratorDto;
}
