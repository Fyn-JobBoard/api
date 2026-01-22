import { Injectable } from '@nestjs/common';
import { CreateActivityDomainDto } from './dto/create-activity-domain.dto';
import { UpdateActivityDomainDto } from './dto/update-activity-domain.dto';

@Injectable()
export class ActivityDomainsService {
  create(createActivityDomainDto: CreateActivityDomainDto) {
    return 'This action adds a new activityDomain';
  }

  findAll() {
    return `This action returns all activityDomains`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activityDomain`;
  }

  update(id: number, updateActivityDomainDto: UpdateActivityDomainDto) {
    return `This action updates a #${id} activityDomain`;
  }

  remove(id: number) {
    return `This action removes a #${id} activityDomain`;
  }
}
