import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsDefined()
  @MaxLength(200)
  @ApiProperty({
    type: 'string',
    required: true,
    maxLength: 200,
  })
  first_name: string;

  @IsDefined()
  @MaxLength(200)
  @ApiProperty({
    type: 'string',
    required: true,
    maxLength: 200,
  })
  last_name: string;

  @IsDefined()
  @IsDateString()
  @ApiProperty({
    type: 'string',
    format: 'date',
    required: true,
  })
  birthdate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'html',
    required: false,
  })
  bio?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: 'string',
    format: 'url',
    isArray: true,
    required: false,
  })
  links?: string[];
}
