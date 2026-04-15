import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ActivityDomain } from 'src/activity-domains/entities/activity-domain.entity';
import { Exists } from 'src/common/validators/exists/exists.decorator';

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

  @IsDefined()
  @ApiProperty({
    type: 'integer',
    description: 'The id of the activity domain the company is associed to',
  })
  @IsPositive()
  @IsInt()
  @Exists(() => ActivityDomain)
  activity_domain_id: number;

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
