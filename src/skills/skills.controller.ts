import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SkillTypes } from 'src/common/enums/skillsTypess';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Get('/')
  @Version('1')
  @ApiQuery({
    name: 'name',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: 'enum',
    enum: SkillTypes,
  })
  @ApiOperation({
    description: 'Find skills based on their name and/or type',
  })
  public async get(
    @Query('name')
    name?: string,
    @Query('type')
    type?: SkillTypes,
  ) {
    return this.service.get({ name, type });
  }

  @Get('/:id')
  @Version('1')
  @ApiParam({
    name: 'id',
    description: 'The id of the tag',
  })
  public async find(
    @Param('id')
    id: number,
  ) {
    const found = await this.service.find(id);
    if (!found) throw new NotFoundException();

    return found;
  }
}
