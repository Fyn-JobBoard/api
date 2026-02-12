import { PartialType } from '@nestjs/swagger';
import { CreateActiveSearchDto } from './create-active-search.dto';

export class UpdateActiveSearchDto extends PartialType(CreateActiveSearchDto) {}
