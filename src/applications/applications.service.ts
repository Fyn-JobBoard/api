import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { Student } from 'src/accounts/entities/student.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applications: Repository<Application>,
  ) {}
  async create(
    dto: CreateApplicationDto,
    job: Job,
    student: Student,
  ): Promise<Application> {
    const existing = await this.applications.findOne({
      where: {
        student: { id: student.id },
        job: { id: job.id },
      },
    });
    if (existing) {
      throw new ConflictException('job already applied for');
    }
    const application = this.applications.create({
      ...dto,
      job,
      student,
    });

    return this.applications.save(application);
  }
  async findAll(query: PaginationQueryDto): Promise<{
    items: Application[];
    page: number;
    pages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [items, total] = await this.applications.findAndCount({
      relations: ['student', 'job', 'job.company'],
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

  async findByStudent(
    studentId: string,
    query: PaginationQueryDto,
  ): Promise<{
    items: Application[];
    page: number;
    pages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [items, total] = await this.applications.findAndCount({
      where: {
        student: { id: studentId },
      },
      relations: ['student', 'job', 'job.company'],
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

  async findOne(id: string): Promise<Application> {
    const application = await this.applications.findOne({
      where: { id },
      relations: ['student', 'job', 'job.company'],
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    const application = await this.findOne(id);

    Object.assign(application, updateApplicationDto);

    return this.applications.save(application);
  }

  async remove(id: string): Promise<Application> {
    const application = await this.findOne(id);
    await this.applications.remove(application);
    return application;
  }
}
