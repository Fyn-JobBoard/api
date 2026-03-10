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
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { ActivityDomainsService } from './activity-domains.service';
import { CreateActivityDomainDto } from './dto/create-activity-domain.dto';
import { UpdateActivityDomainDto } from './dto/update-activity-domain.dto';
import { ActivityDomain } from './entities/activity-domain.entity';
@UseGuards(IsLoggedGuard)
@Controller('activity-domains')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access to this resource.',
})
export class ActivityDomainsController {
  constructor(
    private readonly activityDomainsService: ActivityDomainsService,
  ) {}

  @Post('/')
  @Version('1')
  @ApiOperation({
    summary: 'Create a new activity domain',
    description: 'Only admin can create a new activity domain',
  })
  @IsA([AccountTypes.Admin])
  @ApiBody({ type: CreateActivityDomainDto })
  @ApiOkResponse({
    description: 'The created activity domain',
    type: ActivityDomain,
  })
  async create(@Body() createActivityDomainDto: CreateActivityDomainDto) {
    return this.activityDomainsService.upsertOne(createActivityDomainDto);
  }

  @Get('/')
  @Version('1')
  @ApiOperation({
    summary: 'Get all activity domains',
    description: 'Paginated list of activity domains',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    minimum: 1,
  })
  @ApiOkResponse({
    description: 'List of activity domains',
    type: ActivityDomain,
  })
  findAll(
    @Query('page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    page: number,
    @Query('limit', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    limit: number,
  ) {
    return this.activityDomainsService.findAllPaginated(
      isNaN(page) ? undefined : Math.max(1, page),
      isNaN(limit) ? 20 : Math.max(1, limit),
    );
  }

  @Get('/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Get an activity domain by id',
    description: 'Retrieve a specific activity domain by its ID',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOkResponse({
    description: 'The activity domain found',
    type: ActivityDomain,
  })
  async findOne(@Param('id') id: string) {
    const activityDomain = await this.activityDomainsService.findOne(+id);

    if (!activityDomain) {
      throw new NotFoundException(`ActivityDomain #${id}`);
    }

    return activityDomain;
  }

  @Put('/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Update an activity domain',
    description: 'Only admin can update an activity domain',
  })
  @IsA([AccountTypes.Admin])
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateActivityDomainDto })
  @ApiOkResponse({
    description: 'The activity domain updated',
    type: ActivityDomain,
  })
  async update(
    @Param('id') id: string,
    @Body() updateActivityDomainDto: UpdateActivityDomainDto,
  ) {
    const activityDomain = await this.activityDomainsService.update(
      +id,
      updateActivityDomainDto,
    );

    if (!activityDomain) {
      throw new NotFoundException(`ActivityDomain #${id}`);
    }

    return activityDomain;
  }

  @Delete('/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Delete an activity domain',
    description: 'Only admin can delete an activity domain',
  })
  @IsA([AccountTypes.Admin])
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOkResponse({
    description: 'The deleted activity domain',
    type: ActivityDomain,
  })
  async remove(@Param('id') id: string) {
    const activityDomain = await this.activityDomainsService.remove(+id);

    if (!activityDomain) {
      throw new NotFoundException(`ActivityDomain #${id}`);
    }
    return activityDomain;
  }
}
