import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { Company } from 'src/accounts/entities/company.entity';
import { NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import type { Auth } from 'src/auth/class/auth.class';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { FindOptionsWhere } from 'typeorm';
import { ILike } from 'typeorm';
@Injectable()
export class JobsService {
  constructor(@InjectRepository(Job) private readonly jobs: Repository<Job>) {}
  async create(dto: CreateJobDto, company: Company): Promise<Job> {
    const job = this.jobs.create({
      ...dto,
      ...(company ? { company } : {}),
    });

    return this.jobs.save(job);
  }

  async search(
    query: PaginationQueryDto & { search?: string },
    user: Auth,
  ): Promise<{
    items: Job[];
    page: number;
    pages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const searchQuery = query.search?.trim();
    const where: FindOptionsWhere<Job> = searchQuery
      ? { title: ILike(`%${searchQuery}%`) }
      : {};

    if (user.type === AccountTypes.Student) {
      where.active = true;
    }

    const [items, total] = await this.jobs.findAndCount({
      where,
      relations: ['company'],
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Job | NotFoundException> {
    const job = await this.jobs.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!job) {
      return new NotFoundException('Job not found');
    }
    return job;
  }

  async update(id: string, job: Job | string): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, Job);
    return this.jobs.save(job);
  }

  async remove(id: string): Promise<Job> {
    const job = await this.findOne(id);
    await this.jobs.remove(job);
    return job;
  }
}
