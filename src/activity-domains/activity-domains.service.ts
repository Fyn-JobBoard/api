import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
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

  async findAllPaginated(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [items, total] = await this.activityDomainRepository.findAndCount({
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<ActivityDomain> {
    const activityDomain = await this.activityDomainRepository.findOne({
      where: { id },
    });

    if (!activityDomain) throw new NotFoundException(`ActivityDomain #${id}`);

    return activityDomain;
  }

  async upsertOne(
    domain: number | CreateActivityDomainDto,
  ): Promise<ActivityDomain> {
    if (typeof domain === 'number') {
      return this.findOne(domain);
    }

    await this.activityDomainRepository.upsert(
      {
        name: domain.name.trim(),
        description: domain.description,
      },
      ['name'],
    );

    const found = await this.activityDomainRepository.findOne({
      where: { name: domain.name.trim() },
    });

    if (!found) {
      throw new NotFoundException(
        `ActivityDomain with name ${domain.name} could not be upserted`,
      );
    }

    return found;
  }

  async update(
    id: number,
    updateActivityDomainDto: UpdateActivityDomainDto,
  ): Promise<ActivityDomain> {
    const activityDomain = await this.findOne(id);
    Object.assign(activityDomain, updateActivityDomainDto);
    return this.activityDomainRepository.save(activityDomain);
  }

  async remove(id: number): Promise<void> {
    const activityDomain = await this.findOne(id);
    await this.activityDomainRepository.remove(activityDomain);
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
