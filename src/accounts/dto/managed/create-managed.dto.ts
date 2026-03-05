import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsPositive,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Permissions } from 'src/common/enums/Permissions';

export class CreateManagedDto {
  @IsDefined()
  @MaxLength(150)
  @ApiProperty({
    type: 'string',
    required: true,
  })
  name: string;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    type: 'integer',
    minimum: 0,
    maximum: Object.values(Permissions).reduce(
      (pre, cur) => (typeof cur === 'number' ? pre + cur : pre),
      0,
    ),
    description:
      "The managed account's permissions. Note that you must have the permissions you want to give to the managed account.",
  })
  permissions: number;

  @IsUUID()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    required: false,
  })
  author_id?: string;
}
