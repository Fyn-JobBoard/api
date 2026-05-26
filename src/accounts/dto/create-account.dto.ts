import { ApiProperty, ApiSchema, OmitType, refs } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { LoginDto, LoginResponseDto } from 'src/auth/dto/login.dto';
import { Administrator } from '../entities/admin.entity';
import { Company } from '../entities/company.entity';
import { Managed } from '../entities/managed.entity';
import { Student } from '../entities/student.entity';
import { CreateAdministratorDto } from './administrators/create-administrator.dto';
import { CreateCompanyDto } from './companies/create-company.dto';
import { CreateManagedDto } from './managed/create-managed.dto';
import { CreateStudentDto } from './students/create-student.dto';

@ApiSchema({
  description:
    "You must provide exacly one of 'student', 'company', 'managed' or 'admin' property.",
})
export class CreateAccountDto extends LoginDto {
  @Type(() => CreateStudentDto)
  @ValidateNested()
  @ApiProperty({
    type: CreateStudentDto,
    required: false,
  })
  student?: CreateStudentDto;

  @Type(() => CreateCompanyDto)
  @ValidateNested()
  @ApiProperty({
    type: CreateCompanyDto,
    required: false,
  })
  company?: CreateCompanyDto;

  @Type(() => CreateManagedDto)
  @ValidateNested()
  @ApiProperty({
    type: CreateManagedDto,
    required: false,
  })
  managed?: CreateManagedDto;

  @Type(() => CreateAdministratorDto)
  @ValidateNested()
  @ApiProperty({
    type: CreateAdministratorDto,
    required: false,
  })
  admin?: CreateAdministratorDto;
}

@ApiSchema({
  description: 'The object returned when you create your account',
})
export class CreateAccountResponseDto extends OmitType(LoginResponseDto, [
  'account',
]) {
  @ApiProperty({
    oneOf: refs(Student, Administrator, Company, Managed),
    nullable: false,
  })
  account: Student | Managed | Company | Administrator;
}
