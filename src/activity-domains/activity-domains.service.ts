import { Injectable } from '@nestjs/common';
import { CreateActivityDomainDto } from './dto/create-activity-domain.dto';
import { UpdateActivityDomainDto } from './dto/update-activity-domain.dto';
import { ActivityDomain } from './entities/activity-domain.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
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

  findAll(): Promise<ActivityDomain[]> {
    return this.activityDomainRepository.find();
  }
  async findOne(id: number): Promise<ActivityDomain> {
    const activityDomain = await this.activityDomainRepository.findOne({
      where: { id },
    });

    if (!activityDomain) {
      throw new NotFoundException(`ActivityDomain #${id} introuvable`);
    }

    return activityDomain;
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
