import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'node:assert';
import { Repository } from 'typeorm';
import { CreateActivityDomainDto } from './dto/create-activity-domain.dto';
import { UpdateActivityDomainDto } from './dto/update-activity-domain.dto';
import { ActivityDomain } from './entities/activity-domain.entity';
@Injectable()
export class ActivityDomainsService {
  constructor(
    @InjectRepository(ActivityDomain)
    private readonly activityDomainRepository: Repository<ActivityDomain>,
  ) {}

  async create(dto: CreateActivityDomainDto): Promise<ActivityDomain> {
    const activityDomain = this.activityDomainRepository.create(dto);
    return this.activityDomainRepository.save(activityDomain);
  }

  async findAllPaginated(page = 1, limit = 20) {
    const [items, total] = await this.activityDomainRepository.findAndCount({
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      page,
      pages: Math.ceil(total / limit),
    };
  }
  async findOne(id: number): Promise<ActivityDomain | null> {
    return this.activityDomainRepository.findOne({
      where: { id },
    });
  }

  async upsertOne(domain: CreateActivityDomainDto): Promise<ActivityDomain> {
    const name = domain.name.trim();

    const { identifiers } = await this.activityDomainRepository.upsert(
      {
        name,
        description: domain.description,
      },
      ['name'],
    );

    const found = await this.activityDomainRepository.findOne({
      where: identifiers[0],
    });

    assert(
      found,
      `ActivityDomain with name ${domain.name} could not be upserted`,
    );

    return found;
  }

  async update(
    id: number,
    updateActivityDomainDto: UpdateActivityDomainDto,
  ): Promise<ActivityDomain | HttpException> {
    if (!(await this.activityDomainRepository.exists({ where: { id } }))) {
      return new NotFoundException();
    }
    await this.activityDomainRepository.update({ id }, updateActivityDomainDto);
    return (await this.findOne(id))!;
  }

  async remove(id: number): Promise<ActivityDomain | HttpException> {
    const activityDomain = await this.findOne(id);
    if (!activityDomain) {
      return new NotFoundException();
    }

    await this.activityDomainRepository.remove(activityDomain);
    return activityDomain;
  }

  async findOrCreate(names: string[]): Promise<ActivityDomain[]> {
    return this.activityDomainRepository
      .upsert(
        names.map((name) => ({ name })),
        ['name'],
      )
      .then(({ identifiers }) =>
        identifiers.map((raw) => Object.assign(new ActivityDomain(), raw)),
      );
  }
}
