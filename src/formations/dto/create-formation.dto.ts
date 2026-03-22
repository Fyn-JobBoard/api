import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsInt,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ActivityDomain } from 'src/activity-domains/entities/activity-domain.entity';
import { Exists } from 'src/common/validators/exists/exists.decorator';

export class CreateFormationDto {
  @ApiProperty({
    maxLength: 100,
  })
  @IsDefined()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @MaxLength(200)
  @IsUrl()
  @ApiProperty({
    description:
      'A website that contains more informations about the formation',
    required: false,
    format: 'url',
  })
  info_url?: string;

  @IsOptional()
  @MaxLength(1024)
  @ApiProperty({
    required: false,
  })
  description?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    format: 'date',
  })
  obtention_date?: string;

  @ApiProperty({
    description: 'How long the formation is/has been',
    type: 'integer',
    minimum: 0,
  })
  @IsDefined()
  @IsInt()
  duration: number;

  @IsOptional()
  @IsInt()
  @Exists(ActivityDomain)
  @ApiProperty({
    description:
      "An optionnal activity domain's id this formation is associed to",
    required: false,
    type: 'integer',
    minimum: 0,
  })
  activity_domain_id?: number;
}
