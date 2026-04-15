import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Permissions } from 'src/common/enums/permissions';
import PermissionManager from 'src/common/utils/permissionManager';

export class CreateManagedDto {
  @IsDefined()
  @MaxLength(150)
  @ApiProperty({
    type: 'string',
    required: true,
    maxLength: 150,
  })
  name: string;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    type: 'integer',
    minimum: 0,
    maximum: new PermissionManager().grant(
      ...Object.values(Permissions).filter((p) => typeof p === 'number'),
    ).result,
    description:
      "The managed account's permissions. Note that you must have the permissions you want to give to the managed account.",
  })
  permissions: number;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    required: false,
  })
  author_id?: string;
}
