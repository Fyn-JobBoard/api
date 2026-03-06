import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDefined, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsDefined()
  @MaxLength(250)
  @ApiProperty({
    type: 'string',
    required: true,
  })
  name: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'html',
    required: false,
  })
  bio?: string;

  @IsDefined()
  @IsDate()
  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  creation_date: Date;

  @IsString()
  @IsUrl()
  @ApiProperty({
    type: 'string',
    required: false,
    format: 'url',
  })
  scrapped_from?: string;

  @IsString()
  @IsUrl()
  @ApiProperty({
    type: 'string',
    format: 'url',
    required: false,
  })
  website_url?: string;
}
