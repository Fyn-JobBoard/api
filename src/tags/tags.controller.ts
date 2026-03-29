import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  HttpException,
  NotFoundException,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';
import { UseGuards, Version, Query } from '@nestjs/common';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import {
  ApiBearerAuth,
  ApiBasicAuth,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Tag } from './entities/tag.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@UseGuards(IsLoggedGuard)
@Controller('tags')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access to this resource.',
})
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('/')
  @Version('1')
  @ApiOperation({
    summary: 'Create a new tag',
    description: 'Only admin can create a new tag',
  })
  @IsA([AccountTypes.Admin])
  @ApiBody({ type: CreateTagDto })
  @ApiOkResponse({
    description: 'The created tag',
    type: Tag,
  })
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.upsert(createTagDto).then((r) => r[0]);
  }

  @Get('/')
  @Version('1')
  @ApiOperation({
    summary: 'Get all tags',
    description: 'Any logged user can get all tags',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search tags by name',
    example: 'laravel',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 20,
  })
  @ApiOkResponse({
    description: 'Paginated list of tags',
  })
  async findAll(@Query() query: PaginationQueryDto & { search?: string }) {
    return this.tagsService.search(query);
  }

  @Get('/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Get a tag by id',
    description: 'Any logged user can get a tag by id',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOkResponse({
    description: 'The found tag',
    type: Tag,
  })
  async findOne(@Param('id') id: string) {
    const tag = await this.tagsService.findOneBy(+id);
    if (!tag) {
      throw new NotFoundException();
    }
    return tag;
  }

  @Put('/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Update a tag',
    description: 'Only admin can update a tag',
  })
  @IsA([AccountTypes.Admin])
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateTagDto })
  @ApiOkResponse({
    description: 'The updated tag',
    type: Tag,
  })
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const tag = await this.tagsService.update(+id, updateTagDto);

    if (tag instanceof HttpException) {
      throw tag;
    }
    return tag;
  }
  @Delete('/:id/jobs/:jobId')
  @Version('1')
  @ApiOperation({
    summary: 'Remove a tag from a job',
    description: 'Only admin can remove a tag from a job',
  })
  @IsA([AccountTypes.Admin])
  @ApiParam({ name: 'id', type: 'number' })
  @ApiParam({ name: 'jobId', type: 'number' })
  @ApiOkResponse({
    description: 'The updated tag after job removal',
    type: Tag,
  })
  async removeFromJob(
    @Param('id', ParseIntPipe) id: number,
    @Param('jobId') jobId: string,
  ) {
    const tag = await this.tagsService.removeFromJob(id, jobId);
    if (tag instanceof HttpException) {
      throw tag;
    }

    return tag;
  }
}
