import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { LoginDto } from 'src/auth/dto/login.dto';
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
