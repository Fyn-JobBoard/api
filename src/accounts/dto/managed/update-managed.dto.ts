import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateManagedDto } from './create-managed.dto';

export class UpdateManagedDto extends OmitType(PartialType(CreateManagedDto), [
  'author_id',
]) {}
