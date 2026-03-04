import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Version,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ActivityDomainsService } from './activity-domains.service';
import { CreateActivityDomainDto } from './dto/create-activity-domain.dto';
import { UpdateActivityDomainDto } from './dto/update-activity-domain.dto';

@Controller('activity-domains')
export class ActivityDomainsController {
  constructor(
    private readonly activityDomainsService: ActivityDomainsService,
  ) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a new activity domain' })
  @ApiBody({ type: CreateActivityDomainDto })
  async create(@Body() createActivityDomainDto: CreateActivityDomainDto) {
    return this.activityDomainsService.create(createActivityDomainDto);
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get all activity domains' })
  async findAll() {
    return this.activityDomainsService.findAll();
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: 'Get an activity domain by id' })
  @ApiParam({ name: 'id', type: 'number' })
  async findOne(@Param('id') id: string) {
    return this.activityDomainsService.findOne(+id);
  }

  @Patch(':id')
  @Version('1')
  @ApiOperation({ summary: 'Update an activity domain' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateActivityDomainDto })
  async update(
    @Param('id') id: string,
    @Body() updateActivityDomainDto: UpdateActivityDomainDto,
  ) {
    return this.activityDomainsService.update(+id, updateActivityDomainDto);
  }

  @Delete(':id')
  @Version('1')
  @ApiOperation({ summary: 'Delete an activity domain' })
  @ApiParam({ name: 'id', type: 'number' })
  async remove(@Param('id') id: string) {
    return this.activityDomainsService.remove(+id);
  }
}
