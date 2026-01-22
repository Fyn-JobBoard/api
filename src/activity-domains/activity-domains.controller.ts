import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ActivityDomainsService } from './activity-domains.service';
import { CreateActivityDomainDto } from './dto/create-activity-domain.dto';
import { UpdateActivityDomainDto } from './dto/update-activity-domain.dto';

@Controller()
export class ActivityDomainsController {
  constructor(private readonly activityDomainsService: ActivityDomainsService) {}

  @MessagePattern('createActivityDomain')
  create(@Payload() createActivityDomainDto: CreateActivityDomainDto) {
    return this.activityDomainsService.create(createActivityDomainDto);
  }

  @MessagePattern('findAllActivityDomains')
  findAll() {
    return this.activityDomainsService.findAll();
  }

  @MessagePattern('findOneActivityDomain')
  findOne(@Payload() id: number) {
    return this.activityDomainsService.findOne(id);
  }

  @MessagePattern('updateActivityDomain')
  update(@Payload() updateActivityDomainDto: UpdateActivityDomainDto) {
    return this.activityDomainsService.update(updateActivityDomainDto.id, updateActivityDomainDto);
  }

  @MessagePattern('removeActivityDomain')
  remove(@Payload() id: number) {
    return this.activityDomainsService.remove(id);
  }
}
