import { Controller } from '@nestjs/common';
import { ActivityDomainsService } from './activity-domains.service';
import { CreateActivityDomainDto } from './dto/create-activity-domain.dto';
import { UpdateActivityDomainDto } from './dto/update-activity-domain.dto';

@Controller()
export class ActivityDomainsController {
  constructor(
    private readonly activityDomainsService: ActivityDomainsService,
  ) {}

  create(createActivityDomainDto: CreateActivityDomainDto) {
    return this.activityDomainsService.create(createActivityDomainDto);
  }

  findAll() {
    return this.activityDomainsService.findAll();
  }

  findOne(id: number) {
    return this.activityDomainsService.findOne(id);
  }

  update(updateActivityDomainDto: UpdateActivityDomainDto) {
    return this.activityDomainsService.update(
      updateActivityDomainDto.id,
      updateActivityDomainDto,
    );
  }

  remove(id: number) {
    return this.activityDomainsService.remove(id);
  }
}
