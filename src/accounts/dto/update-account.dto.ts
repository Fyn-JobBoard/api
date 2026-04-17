import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends OmitType(PartialType(CreateAccountDto), [
  'admin',
  'student',
  'managed',
  'company',
]) {}
