import {
  IsArray,
  IsDate,
  IsDefined,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsDefined()
  @MaxLength(200)
  first_name: string;

  @IsDefined()
  @MaxLength(200)
  last_name: string;

  @IsDefined()
  @IsDate()
  birthdate: Date;

  @IsString()
  bio?: string;

  @IsArray()
  links?: string[];
}
