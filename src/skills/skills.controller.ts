import {
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Put,
  Query,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SkillTypes } from 'src/common/enums/skillsTypes';
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
    type: 'number',
  })
  @ApiOperation({
    description: 'Find a skill by its id.',
  })
  public async find(
    @Param('id')
    id: number,
  ) {
    const found = await this.service.find(id);
    if (!found) throw new NotFoundException();

    return found;
  }

  @Put('/:id/:student_id')
  @Version('1')
  @ApiParam({
    name: 'id',
    description: 'The id of the skill to apply',
    required: true,
    type: 'number',
  })
  @ApiParam({
    name: 'student_id',
    required: false,
    type: 'uuid',
    description:
      "The student's id to which you want to apply the tag. If ommited, it applies to yourself.",
  })
  @ApiOperation({
    description: 'Apply a skill to a student or to yourself',
  })
  public apply(
    @Param('id')
    id: number,
    @Param('student_id')
    student_id?: string,
  ) {
    throw new NotImplementedException();
  }
}
