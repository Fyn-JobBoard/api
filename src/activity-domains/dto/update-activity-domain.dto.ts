import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDomainDto } from './create-activity-domain.dto';

export class UpdateActivityDomainDto extends PartialType(
  CreateActivityDomainDto,
) {
  name: string;
  description?: string;
}
