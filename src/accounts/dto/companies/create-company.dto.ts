import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateCompanyDto {
  @IsDefined()
  @MaxLength(250)
  @ApiProperty({
    type: 'string',
    required: true,
    maxLength: 250,
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'html',
    required: false,
  })
  bio?: string;

  @IsDefined()
  @IsDateString()
  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  creation_date: Date;

  @IsOptional()
  @IsString()
  @IsUrl()
  @ApiProperty({
    type: 'string',
    required: false,
    format: 'url',
  })
  scrapped_from?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @ApiProperty({
    type: 'string',
    format: 'url',
    required: false,
  })
  website_url?: string;
}
