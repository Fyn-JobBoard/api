import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateActivityDomainDto {
  @IsDefined()
  @IsString()
  @MaxLength(60)
  @ApiProperty({
    type: 'string',
    maxLength: 60,
  })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  @ApiProperty({
    required: false,
    type: 'string',
    maxLength: 1500,
  })
  description?: string;
}
