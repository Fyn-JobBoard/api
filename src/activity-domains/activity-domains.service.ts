import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'node:assert';
import { In, Repository } from 'typeorm';
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
    const cleaned = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
    if (cleaned.length === 0) return [];

    const existing = await this.activityDomainRepository.find({
      where: { name: In(cleaned) },
    });

    const existingNames = new Set(existing.map((d) => d.name));
    const toCreate = cleaned
      .filter((name) => !existingNames.has(name))
      .map((name) => this.activityDomainRepository.create({ name }));

    const created =
      toCreate.length > 0
        ? await this.activityDomainRepository.save(toCreate)
        : [];

    return [...existing, ...created];
  }
}
