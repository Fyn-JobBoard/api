import {
  Injectable,
  NotFoundException,
  ForbiddenException,
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
import { AccountTypes } from 'src/common/enums/accountTypes';
import { RequestUser } from 'src/common/dto/types/request-user.type';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applications: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobs: Repository<Job>,
    @InjectRepository(Student)
    private readonly students: Repository<Student>,
  ) {}
  async create(
    dto: CreateApplicationDto,
    jobId: string,
    studentId: string,
  ): Promise<Application> {
    const job = await this.jobs.findOneBy({ id: jobId });
    if (!job) {
      throw new NotFoundException();
    }

    const student = await this.students.findOneBy({ id: studentId });
    if (!student) {
      throw new NotFoundException();
    }
    const existing = await this.applications.findOne({
      where: {
        student: { id: studentId },
        job: { id: jobId },
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
      relations: ['student', 'job'],
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

  async findOne(id: string, user: RequestUser): Promise<Application> {
    const application = await this.applications.findOne({
      where: { id },
      relations: ['student', 'job', 'job.company'],
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (user.accountType === AccountTypes.Admin) {
      return application;
    }

    if (
      user.accountType === AccountTypes.Student &&
      application.student.id === user.id
    ) {
      return application;
    }

    if (
      user.accountType === AccountTypes.Company &&
      application.job.company.id === user.id
    ) {
      return application;
    }

    throw new ForbiddenException('You do not have access to this application');
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
    user: RequestUser,
  ): Promise<Application> {
    const application = await this.applications.findOne({
      where: { id },
      relations: ['student', 'job', 'job.company'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (
      user.accountType !== AccountTypes.Student ||
      application.student.id !== user.id
    ) {
      throw new ForbiddenException('You cannot update this application');
    }

    await this.applications.update({ id }, updateApplicationDto);

    return this.findOne(id, user);
  }

  async remove(id: string, studentId: string): Promise<Application> {
    const application = await this.applications.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!application) {
      throw new NotFoundException();
    }
    if (application.student.id !== studentId) {
      throw new ForbiddenException('You cannot delete this application');
    }
    await this.applications.remove(application);
    return application;
  }
}
