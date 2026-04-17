import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/accounts/entities/company.entity';
import type { Auth } from 'src/auth/class/auth.class';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { ILike, Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { ListJobsResponse } from './dto/list-jobs-response.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(@InjectRepository(Job) private readonly jobs: Repository<Job>) {}
  async create(company: Company, dto: CreateJobDto): Promise<Job> {
    const job = this.jobs.create({
      ...dto,
      company,
    });

    return this.jobs.save(job);
  }

  async search(
    query: PaginationQueryDto & { search?: string },
    user: Auth,
  ): Promise<ListJobsResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    let sql = this.jobs.createQueryBuilder();

    let q: string | undefined;
    if ((q = query.search?.trim())) {
      const like = ILike(`%${q}%`);
      sql
        .where({
          title: like,
        })
        .orWhere({
          description: like,
        });
    }

    if (user.type === AccountTypes.Student) {
      sql.andWhere({
        active: true,
      });
    }

    sql
      .orderBy('id')
      .skip((page - 1) * limit)
      .take(limit)
      .relation('company');

    const [list, total] = await sql.getManyAndCount();
    return {
      list,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.jobs.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  async update<
    JobArg extends string | Job,
    R = JobArg extends string ? Job | NotFoundException : Job,
  >(job: JobArg, updateJobDto: UpdateJobDto): Promise<R> {
    const job_to_update = job instanceof Job ? job : await this.findOne(job);

    if (!job_to_update) {
      return new NotFoundException() as R;
    }

    Object.assign(job_to_update, updateJobDto);
    return this.jobs.save(job_to_update) as R;
  }

  async remove<
    JobArg extends string | Job,
    R = JobArg extends string ? Job | NotFoundException : Job,
  >(job: JobArg): Promise<R> {
    const existing = job instanceof Job ? job : await this.findOne(job);
    if (!existing) {
      return new NotFoundException() as R;
    }

    await this.jobs.delete(existing.id);

    return existing as R;
  }
}
