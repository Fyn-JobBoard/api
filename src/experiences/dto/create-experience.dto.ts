import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Company } from 'src/accounts/entities/company.entity';
import { Exists } from 'src/common/validators/exists/exists.decorator';

export class CreateExperienceDto {
  @ApiProperty({
    maxLength: 100,
  })
  @IsDefined()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    maxLength: 2048,
  })
  @IsDefined()
  @MaxLength(2048)
  description: string;

  @ApiProperty({
    format: 'date',
  })
  @IsDateString()
  @IsDefined()
  begin_date: string;

  @ApiProperty({
    format: 'date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({
    type: 'string',
    description: 'Id of the company the student worked in',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  @Exists(Company)
  company_id?: string;

  @ApiProperty({
    required: false,
    maxLength: 70,
  })
  @IsOptional()
  @MaxLength(70)
  company_fallback_name?: string;
}
