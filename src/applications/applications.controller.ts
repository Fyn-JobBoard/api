import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import assert from 'node:assert';
import { extname } from 'path';
import { Student } from 'src/accounts/entities/student.entity';
import type { Auth } from 'src/auth/class/auth.class';
import { Authenticated } from 'src/auth/decorators/getters/account/account.decorator';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { ApplicationStatus } from 'src/common/enums/applicationStatus';
import { Permissions } from 'src/common/enums/permissions';
import { Job } from 'src/jobs/entities/job.entity';
import { Repository } from 'typeorm';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';

@UseGuards(IsLoggedGuard)
@Controller('applications')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access to this resource.',
})
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    @InjectRepository(Job)
    private readonly jobs: Repository<Job>,
  ) {}

  @Post('/')
  @Version('1')
  @ApiOperation({ summary: 'Create a new application' })
  @ApiBody({ type: CreateApplicationDto })
  @IsA([AccountTypes.Student])
  @ApiParam({ name: 'jobId', type: String })
  @ApiResponse({
    description: 'The application has been successfully created.',
    type: Application,
  })
  @UseInterceptors(
    FileInterceptor('attachment', {
      storage: diskStorage({
        destination: './uploads/cv',
        filename: (_req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(
            new BadRequestException('Only PDF files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('jobId') jobId: string,
    @Authenticated() user: Auth,
  ) {
    if (!file) {
      throw new BadRequestException('Attachment is required');
    }
    const job = await this.jobs.findOneBy({ id: jobId });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const student = await user.account();
    assert(student instanceof Student);
    return this.applicationsService.create(
      {
        ...createApplicationDto,
        attachment: file.filename,
      },
      job,
      student,
    );
  }

  @Get('/')
  @Version('1')
  @IsA([AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.VIEW_APPLICATIONS),
  })
  @ApiOperation({ summary: 'Get all applications with pagination' })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.applicationsService.findAll(query);
  }
  @Get('/mine')
  @Version('1')
  @IsA([AccountTypes.Student])
  @ApiOperation({
    summary: 'Get all applications of the authenticated student',
  })
  @ApiResponse({
    description: 'List of applications of the authenticated student',
    type: [Application],
  })
  async findMine(
    @Authenticated() user: Auth,
    @Query() query: PaginationQueryDto,
  ) {
    return this.applicationsService.findByStudent(user.id, query);
  }

  @Get('/:id')
  @Version('1')
  @IsA([AccountTypes.Student, AccountTypes.Admin, AccountTypes.Company])
  @ApiOperation({ summary: 'Get a specific application' })
  @ApiParam({ name: 'id', type: 'string' })
  async findOne(@Param('id') id: string, @Authenticated() user: Auth) {
    const application = await this.applicationsService.findOne(id);
    if (user.type === AccountTypes.Admin) {
      return application;
    }

    if (
      user.type === AccountTypes.Student &&
      application.student.id === user.id
    ) {
      return application;
    }

    if (
      user.type === AccountTypes.Company &&
      application.job.company.id === user.id
    ) {
      return application;
    }
    throw new ForbiddenException('You do not have access to this resource');
  }

  @Put('/:id')
  @Version('1')
  @ApiOperation({ summary: 'Update an application' })
  @IsA([AccountTypes.Student])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateApplicationDto })
  @ApiResponse({
    description: 'The application has been successfully updated.',
    type: Application,
  })
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Authenticated() user: Auth,
  ) {
    const application = await this.applicationsService.findOne(id);

    const isOwner =
      user.type === AccountTypes.Student && application.student.id === user.id;

    const isAdmin = user.type === AccountTypes.Admin;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot update this application');
    }

    if (!application.job.active) {
      throw new BadRequestException(
        'You cannot update an application for a closed job',
      );
    }

    if (
      application.status === ApplicationStatus.Accepted ||
      application.status === ApplicationStatus.Refused
    ) {
      throw new BadRequestException(
        'This application can no longer be updated',
      );
    }

    if (
      user.type === AccountTypes.Student &&
      application.status !== ApplicationStatus.Draft
    ) {
      throw new BadRequestException(
        'A student can only update a draft application',
      );
    }
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete('/:id')
  @Version('1')
  @ApiOperation({ summary: 'Delete an application' })
  @IsA([AccountTypes.Student])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    description: 'The application has been successfully deleted.',
    type: Application,
  })
  async remove(@Param('id') id: string, @Authenticated() user: Auth) {
    const application = await this.applicationsService.findOne(id);
    if (application.student.id !== user.id) {
      throw new ForbiddenException('You do not have access to this resource');
    }
    return this.applicationsService.remove(id);
  }
}
