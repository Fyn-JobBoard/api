import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateActivityDomainDto {
  @IsDefined()
  @IsString()
  @MaxLength(60)
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @IsOptional()
  @IsString()
  @MaxLength(1500)
  @ApiProperty({ required: false, type: 'string' })
  description?: string;
}
