import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Version,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import {
  ApiBearerAuth,
  ApiBasicAuth,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Job } from './entities/job.entity';
import { Authenticated } from 'src/auth/decorators/getters/account/account.decorator';
import type { Auth } from 'src/auth/class/auth.class';
import { ForbiddenException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Company } from 'src/accounts/entities/company.entity';
import { BadRequestException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Admin } from 'typeorm';

@UseGuards(IsLoggedGuard)
@Controller('jobs')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access to this resource.',
})
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('/company_id')
  @Version('1')
  @ApiOperation({
    summary: 'Create a new job offer',
    description: 'Only admin and company users can create a new job offer',
  })
  @IsA([AccountTypes.Company])
  @ApiBody({ type: CreateJobDto })
  @ApiOkResponse({
    description: 'The created job offer',
    type: Job,
  })
  async create(@Body() dto: CreateJobDto, @Authenticated() user: Auth) {
    let company: Company | null = null;

    if (user.type === AccountTypes.Company) {
      company = (await user.account()) as unknown as Company | null;

      if (!company) {
        throw new NotFoundException('Company not found');
      }
    }

    if (dto.remuneration && dto.remuneration < 0) {
      throw new BadRequestException('Invalid remuneration');
    }

    if (dto.period_duration && dto.period_duration <= 0) {
      throw new BadRequestException('Invalid duration');
    }

    return this.jobsService.create(
      {
        ...dto,
        active: true,
      },
      company,
    );
  }

  @Post('/')
  @Version('1')
  @ApiOperation({
    summary: 'Create multiple job offers for a company',
    description:
      'Only Admin users can create multiple job offers for a company',
  })
  @IsA([AccountTypes.Admin])
  @ApiBody({ type: [CreateJobDto] })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({
    description: 'The created job offers',
    type: Job,
  })
  async createManyForCompany(
    @Body() dto: CreateJobDto,
    @Authenticated() user: Auth,
  ) {
    let admin: Admin | null = null;

    if (user.type === AccountTypes.Admin) {
      admin = (await user.account()) as unknown as Admin | null;

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
    }

    if (dto.remuneration && dto.remuneration < 0) {
      throw new BadRequestException('Invalid remuneration');
    }

    if (dto.period_duration && dto.period_duration <= 0) {
      throw new BadRequestException('Invalid duration');
    }

    return this.jobsService.create(
      {
        ...dto,
        active: true,
      },
      admin,
    );
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
  @IsA([AccountTypes.Admin, AccountTypes.Company, AccountTypes.Student])
  @ApiOkResponse({
    description: 'List of job offers',
    type: [Job],
  })
  async findAll(
    @Query() query: PaginationQueryDto & { search?: string },
    @Authenticated() user: Auth,
  ) {
    return this.jobsService.search(query, user);
  }

  @Get('/:id')
  @Version('1')
  @ApiOperation({ summary: 'Get a job offer by ID' })
  @IsA([AccountTypes.Admin, AccountTypes.Company, AccountTypes.Student])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({
    description: 'The requested job offer',
    type: Job,
  })
  async findOne(@Param('id') id: string, @Authenticated() user: Auth) {
    const job = await this.jobsService.findOne(id);
    if (user.type === AccountTypes.Admin) {
      return job;
    }

    if (user.type === AccountTypes.Company) {
      return job;
    }

    if (user.type === AccountTypes.Student && job.active) {
      return job;
    }
    throw new ForbiddenException('You do not have access to this resource');
  }

  @Put('/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Update a job offer',
    description: 'Only company users can update a job offer',
  })
  @IsA([AccountTypes.Company, AccountTypes.Admin])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateJobDto })
  @ApiOkResponse({
    description: 'The updated job offer',
    type: Job,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
    @Authenticated() user: Auth,
  ) {
    const job = await this.jobsService.findOne(id);

    if (user.type === AccountTypes.Company) {
      const company = await user.account();

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      if (job.company?.id !== company.id) {
        throw new ForbiddenException('You can only update your own job offers');
      }
    }

    return this.jobsService.update(id, dto);
  }

  @Delete('/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Delete a job offer',
    description: 'Only company users can delete a job offer',
  })
  @IsA([AccountTypes.Company])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({
    description: 'The deleted job offer',
    type: Job,
  })
  async remove(@Param('id') id: string, @Authenticated() user: Auth) {
    const job = await this.jobsService.findOne(id);

    if (user.type === AccountTypes.Company) {
      const company = await user.account();

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      if (job.company?.id !== company.id) {
        throw new ForbiddenException('You can only delete your own job offers');
      }
    }
    return this.jobsService.remove(id);
  }
}
