import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateActivityDomainDto } from './dto/create-activity-domain.dto';
import { ListActivityDomainResponseDto } from './dto/list-activity-domain-response.dto';
import { UpdateActivityDomainDto } from './dto/update-activity-domain.dto';
import { ActivityDomain } from './entities/activity-domain.entity';
@Injectable()
export class ActivityDomainsService {
  constructor(
    @InjectRepository(ActivityDomain)
    private readonly activityDomains: Repository<ActivityDomain>,
  ) {}

  async create(dto: CreateActivityDomainDto): Promise<ActivityDomain> {
    const activityDomain = this.activityDomains.create(dto);
    return this.activityDomains.save(activityDomain);
  }

  async findAllPaginated(page = 1, limit = 20, query?: string) {
    const [list, total] = await this.activityDomains.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: query
        ? {
            name: ILike(`%${query}%`),
          }
        : undefined,
    });

    return {
      list,
      page,
      pages: Math.ceil(total / limit),
    } satisfies ListActivityDomainResponseDto;
  }
  async findOne(id: number): Promise<ActivityDomain | null> {
    return this.activityDomains.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updateActivityDomainDto: UpdateActivityDomainDto,
  ): Promise<ActivityDomain | HttpException> {
    if (!(await this.activityDomains.exists({ where: { id } }))) {
      return new NotFoundException();
    }
    await this.activityDomains.update({ id }, updateActivityDomainDto);
    return (await this.findOne(id))!;
  }

  async remove(id: number): Promise<ActivityDomain | HttpException> {
    const activityDomain = await this.findOne(id);
    if (!activityDomain) {
      return new NotFoundException();
    }

    await this.activityDomains.remove(activityDomain);
    return activityDomain;
  }

  async upsert(
    ...domains: CreateActivityDomainDto[]
  ): Promise<ActivityDomain[]> {
    return this.activityDomains
      .upsert(
        domains.map((domain) => ({
          ...domain,
          name: domain.name.trim(),
        })),
        ['name'],
      )
      .then(({ identifiers }) =>
        Promise.all(
          identifiers.map(async (raw) => (await this.findOne(+raw.id))!),
        ),
      );
  }
}
