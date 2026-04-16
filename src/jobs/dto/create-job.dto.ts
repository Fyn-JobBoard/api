import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Languages } from 'src/common/enums/languages';
import { RemunerationPeriods } from 'src/common/enums/remunerationPeriods';
import { WorkingModes } from 'src/common/enums/workingModes';
import { ContractTypes } from 'src/common/enums/contractTypes';

export class CreateJobDto {
  @IsDefined()
  @ApiProperty({
    maxLength: 100,
  })
  @MaxLength(100)
  title: string;

  @IsDefined()
  @ApiProperty({
    maxLength: 4096,
  })
  @MaxLength(4096)
  description: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(250)
  apply_link?: string;

  @IsEnum(Languages)
  @IsDefined()
  @ApiProperty({
    description: 'The language of the job offer',
    enum: Languages,
  })
  status: Languages;

  @IsDecimal()
  @IsOptional()
  lat?: number;

  @IsDecimal()
  @IsOptional()
  lng?: number;

  @IsEnum(WorkingModes)
  @IsDefined()
  @ApiProperty({
    description: 'The working mode of the job offer',
    enum: WorkingModes,
  })
  mode: WorkingModes;

  @IsOptional()
  @ApiProperty({
    description: 'The source of the job offer',
  })
  @MaxLength(200)
  scrapped_from?: string;

  @IsDecimal()
  remuneration: number;

  @IsEnum(RemunerationPeriods)
  @IsDefined()
  @ApiProperty({
    description: 'The remuneration period of the job offer',
    enum: RemunerationPeriods,
  })
  remuneration_period: RemunerationPeriods;

  @IsEnum(ContractTypes)
  @IsDefined()
  @ApiProperty({
    description: 'The contract type of the job offer',
    enum: ContractTypes,
  })
  contract_type: ContractTypes;

  @IsOptional()
  @ApiProperty({
    description: 'The start date of the job offer',
  })
  period_start?: Date;

  @IsInt()
  @IsDefined()
  @ApiProperty({
    description: 'The duration of the job offer in months',
  })
  period_duration: number;

  @IsOptional()
  @ApiProperty({
    description:
      'The minimum formation duration required for the job offer in months',
  })
  min_formation_duration?: number;

  @IsDefined()
  @ApiProperty({
    description: 'Whether the job offer is active or not',
  })
  active: boolean;

  @IsOptional()
  @ApiProperty({
    description: 'The feedback from the moderation team',
  })
  @MaxLength(1024)
  moderation_feedback?: string;
}
