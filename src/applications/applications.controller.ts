import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import {
  ApiBearerAuth,
  ApiBasicAuth,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Version } from '@nestjs/common';
import { Application } from './entities/application.entity';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { UseGuards } from '@nestjs/common';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { RequestUser } from 'src/common/dto/types/request-user.type';

@UseGuards(IsLoggedGuard)
@Controller('applications')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access to this resource.',
})
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('/')
  @Version('1')
  @ApiOperation({ summary: 'Create a new application' })
  @ApiBody({ type: CreateApplicationDto })
  @IsA([AccountTypes.Student])
  @ApiParam({ name: 'job_id', type: 'string' })
  @ApiParam({ name: 'student_id', type: 'string' })
  @ApiResponse({
    description: 'The application has been successfully created.',
    type: Application,
  })
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Param('job_id') jobId: string,
    @Param('student_id') studentId: string,
  ) {
    return this.applicationsService.create(
      createApplicationDto,
      jobId,
      studentId,
    );
  }

  @Get('/')
  @Version('1')
  @IsA([AccountTypes.Admin])
  async findAll(@Query() query: PaginationQueryDto) {
    return this.applicationsService.findAll(query);
  }

  @Get('/:id')
  @Version('1')
  @IsA([AccountTypes.Student, AccountTypes.Admin, AccountTypes.Company])
  async findOne(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    return this.applicationsService.findOne(id, req.user);
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
    @Req() req: { user: RequestUser },
  ) {
    return this.applicationsService.update(id, updateApplicationDto, req.user);
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
  async remove(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    return this.applicationsService.remove(id, req.user.id);
  }
}
