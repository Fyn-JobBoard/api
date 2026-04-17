import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, MaxLength } from 'class-validator';

export class CreateAdministratorDto {
  @IsDefined()
  @MaxLength(200)
  @ApiProperty({
    type: 'string',
    maxLength: 200,
  })
  first_name: string;

  @IsDefined()
  @MaxLength(200)
  @ApiProperty({
    type: 'string',
    maxLength: 200,
  })
  last_name: string;
}
