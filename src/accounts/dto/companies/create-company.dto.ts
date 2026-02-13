import { IsDate, IsDefined, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsDefined()
  @MaxLength(250)
  name: string;

  @IsString()
  bio?: string;

  @IsDefined()
  @IsDate()
  creation_date: Date;

  @IsString()
  @IsUrl()
  scrapped_from?: string;

  @IsString()
  @IsUrl()
  website_url?: string;
}
