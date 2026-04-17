import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AccountsService } from 'src/accounts/accounts.service';
import { Company } from 'src/accounts/entities/company.entity';
import { Auth } from 'src/auth/class/auth.class';
import {
  AuthAccount,
  Authenticated,
} from 'src/auth/decorators/getters/account/account.decorator';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Permissions } from 'src/common/enums/permissions';
import { CreateJobDto } from './dto/create-job.dto';
import { ListJobsResponse } from './dto/list-jobs-response.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { JobsService } from './jobs.service';

@UseGuards(IsLoggedGuard)
@Controller('jobs')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access to this resource.',
})
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('/:company_id')
  @Version('1')
  @ApiOperation({
    summary: 'Create a new job offer',
    description: 'Only admin and company users can create a new job offer',
  })
  @IsA([AccountTypes.Company, AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_JOBS),
  })
  @ApiBody({ type: CreateJobDto })
  @ApiOkResponse({
    description: 'The created job offer',
    type: Job,
  })
  async create(
    @Param('company_id')
    company_id: string,
    @Body() dto: CreateJobDto,
    @Authenticated() user: Auth,
  ) {
    if (
      user.type === AccountTypes.Company &&
      (company_id !== user.id || dto.moderation_feedback)
    ) {
      throw new UnauthorizedException();
    }

    const company = await this.accountsService.findModel(company_id, Company);
    if (!company) {
      throw new NotFoundException();
    }

    return this.jobsService.create(company, dto);
  }

  @Post('/')
  @Version('1')
  @ApiOperation({
    summary: 'Create a new job offer as a company',
    description: 'Only companies can use this endpoint',
  })
  @IsA([AccountTypes.Company])
  @ApiBody({ type: CreateJobDto })
  @ApiOkResponse({
    description: 'The created job',
    type: Job,
  })
  async createForCompany(@Body() dto: CreateJobDto, @AuthAccount() auth: Auth) {
    return this.create(auth.id, dto, auth);
  }

  @Get('/')
  @Version('1')
  @ApiOperation({ summary: 'Get all job offers' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for job titles',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page for pagination',
    example: 20,
  })
  @ApiOkResponse({
    description: 'List of job offers',
    type: ListJobsResponse,
  })
  async findAll(
    @Query() query: PaginationQueryDto & { search?: string },
    @Authenticated() user: Auth,
  ) {
    return this.jobsService.search(query, user);
  }

  @Get('/:job_id')
  @Version('1')
  @ApiOperation({ summary: 'Get a job offer by ID' })
  @ApiParam({ name: 'job_id', type: 'string' })
  @ApiOkResponse({
    description: 'The requested job offer',
    type: Job,
  })
  async findOne(@Param('id') job_id: string, @Authenticated() user: Auth) {
    const job = await this.jobsService.findOne(job_id);
    if (!job) {
      throw new NotFoundException();
    }

    if (
      !(
        job.active ||
        [AccountTypes.Admin, AccountTypes.Managed].includes(user.type) ||
        job.company.id === user.id
      )
    ) {
      // Not found as job is not active
      throw new NotFoundException();
    }

    return job;
  }

  @Put('/:job_id')
  @Version('1')
  @ApiOperation({
    summary: 'Update a job offer',
  })
  @IsA([AccountTypes.Company, AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_JOBS),
  })
  @ApiParam({
    name: 'job_id',
    type: 'string',
    description: "The job's id to update",
  })
  @ApiBody({ type: UpdateJobDto })
  @ApiOkResponse({
    description: 'The updated job offer',
    type: Job,
  })
  async update(
    @Param('job_id') job_id: string,
    @Body() dto: UpdateJobDto,
    @Authenticated() user: Auth,
  ) {
    const job = await this.jobsService.findOne(job_id);
    if (
      !(
        job &&
        ([AccountTypes.Admin, AccountTypes.Managed].includes(user.type) ||
          job.company.id === user.id)
      )
    ) {
      throw new NotFoundException();
    }

    if (dto.moderation_feedback && user.type !== AccountTypes.Admin) {
      throw new UnauthorizedException();
    }

    return this.jobsService.update(job, dto);
  }

  @Delete('/:job_id')
  @Version('1')
  @ApiOperation({
    summary: 'Delete a job offer',
  })
  @IsA([AccountTypes.Company, AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_JOBS),
  })
  @ApiParam({
    name: 'job_id',
    type: 'string',
    description: "The job's id to delete",
  })
  @ApiOkResponse({
    description: 'The deleted job offer',
    type: Job,
  })
  async remove(@Param('id') id: string, @Authenticated() user: Auth) {
    const job = await this.jobsService.findOne(id);
    if (
      !(
        job &&
        ([AccountTypes.Admin, AccountTypes.Managed].includes(user.type) ||
          job.company.id === user.id)
      )
    ) {
      throw new NotFoundException();
    }

    return this.jobsService.remove(job);
  }
}
