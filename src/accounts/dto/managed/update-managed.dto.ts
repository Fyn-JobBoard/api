import { PartialType } from '@nestjs/swagger';
import { CreateManagedDto } from './create-managed.dto';

export class UpdateManagedDto extends PartialType(CreateManagedDto) {}
