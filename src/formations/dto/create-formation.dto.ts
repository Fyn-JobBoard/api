import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsInt,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ActivityDomain } from 'src/activity-domains/entities/activity-domain.entity';
import { Exists } from 'src/common/validators/exists/exists.decorator';

export class CreateFormationDto {
  @ApiProperty()
  @IsDefined()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @MaxLength(200)
  @IsUrl()
  @ApiProperty({
    description:
      'A website that contains more informations about the formation',
  })
  info_url?: string;

  @IsOptional()
  @MaxLength(1024)
  @ApiProperty()
  description?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  obtention_date?: Date;

  @ApiProperty({
    description: 'How long the formation is',
  })
  @IsDefined()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsInt()
  @Type(() => ActivityDomain)
  @Exists(() => ActivityDomain)
  @ApiProperty()
  activity_domain_id?: number;
}
