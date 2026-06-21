import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/accounts/entities/student.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Job } from 'src/jobs/entities/job.entity';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ListApplicationsResponseDto } from './dto/list.response.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';

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
  async findAll(
    query: PaginationQueryDto,
  ): Promise<ListApplicationsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [list, total] = await this.applications.findAndCount({
      relations: ['student', 'job', 'job.company'],
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return Object.assign(new ListApplicationsResponseDto(), {
      list,
      page,
      pages: Math.ceil(total / limit),
    });
  }

  async findByStudent(
    studentId: string,
    query: PaginationQueryDto,
  ): Promise<ListApplicationsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [list, total] = await this.applications.findAndCount({
      where: {
        student: { id: studentId },
      },
      relations: ['student', 'job', 'job.company'],
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return Object.assign(new ListApplicationsResponseDto(), {
      list,
      page,
      pages: Math.ceil(total / limit),
    });
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
