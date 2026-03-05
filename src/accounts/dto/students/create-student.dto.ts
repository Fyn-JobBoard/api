import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    type: 'string',
    required: true,
  })
  first_name: string;

  @IsDefined()
  @MaxLength(200)
  @ApiProperty({
    type: 'string',
    required: true,
  })
  last_name: string;

  @IsDefined()
  @IsDate()
  @ApiProperty({
    type: 'string',
    format: 'date',
    required: true,
  })
  birthdate: Date;

  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'html',
    required: false,
  })
  bio?: string;

  @IsArray()
  @ApiProperty({
    type: 'string',
    format: 'url',
    isArray: true,
  })
  links?: string[];
}
