import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ActivityDomain } from 'src/activity-domains/entities/activity-domain.entity';
import { ContractTypes } from 'src/common/enums/contractTypes';
import { Languages } from 'src/common/enums/languages';
import { RemunerationPeriods } from 'src/common/enums/remunerationPeriods';
import { WorkingModes } from 'src/common/enums/workingModes';
import { Exists } from 'src/common/validators/exists/exists.decorator';

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

  @IsEnum(() => Languages, {
    each: true,
  })
  @IsDefined()
  @ApiProperty({
    description: 'The language of the job offer',
    enum: () => Languages,
    isArray: true,
  })
  language: Languages[];

  @IsDecimal()
  @IsOptional()
  @Min(0)
  @Max(90)
  lat?: number;

  @IsDecimal()
  @IsOptional()
  @Min(-180)
  @Max(180)
  lng?: number;

  @IsEnum(() => WorkingModes)
  @IsDefined()
  @ApiProperty({
    description: 'The working mode of the job offer',
    enum: () => WorkingModes,
  })
  mode: WorkingModes;

  @IsOptional()
  @ApiProperty({
    description: 'The source of the job offer',
  })
  @MaxLength(200)
  @IsUrl()
  scrapped_from?: string;

  @IsDecimal()
  @Min(0)
  remuneration: number;

  @IsEnum(() => RemunerationPeriods)
  @IsDefined()
  @ApiProperty({
    description: 'The remuneration period of the job offer',
    enum: () => RemunerationPeriods,
  })
  remuneration_period: RemunerationPeriods;

  @IsEnum(() => ContractTypes)
  @IsDefined()
  @ApiProperty({
    description: 'The contract type of the job offer',
    enum: () => ContractTypes,
  })
  contract: ContractTypes;

  @IsOptional()
  @ApiProperty({
    description: 'The start date of the job offer',
  })
  @IsDateString()
  period_start?: string;

  @IsInt()
  @IsDefined()
  @ApiProperty({
    description: 'The duration of the job offer in months',
  })
  @IsPositive()
  period_duration: number;

  @IsOptional()
  @ApiProperty({
    description:
      'The minimum formation duration required for the job offer in months',
  })
  @IsInt()
  @IsPositive()
  min_formation_duration?: number;

  @IsDefined()
  @ApiProperty({
    description: 'Whether the job offer is active or not',
  })
  @IsBoolean()
  active: boolean;

  @IsDefined()
  @Exists(() => ActivityDomain)
  @ApiProperty({
    type: 'number',
    description: 'The activity domain of the job offer',
  })
  activity_domain_id: number;

  @IsOptional()
  @ApiProperty({
    description: 'The feedback from the moderation team',
  })
  @MaxLength(1024)
  moderation_feedback?: string;
}
