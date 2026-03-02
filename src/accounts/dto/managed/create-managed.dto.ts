import {
  IsDefined,
  IsNumber,
  IsPositive,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateManagedDto {
  @IsDefined()
  @MaxLength(150)
  name: string;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  permissions: string;

  @IsUUID()
  author_id?: string;
}
