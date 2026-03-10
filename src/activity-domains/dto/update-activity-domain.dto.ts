import { PartialType } from '@nestjs/swagger';
import { CreateActivityDomainDto } from './create-activity-domain.dto';

export class UpdateActivityDomainDto extends PartialType(
  CreateActivityDomainDto,
) {}
