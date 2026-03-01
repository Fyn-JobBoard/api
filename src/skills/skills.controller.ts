import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  Param,
  Patch,
  Put,
  Query,
  Version,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AccountsService } from 'src/accounts/accounts.service';
import { Student } from 'src/accounts/entities/student.entity';
import { SkillTypes } from 'src/common/enums/skillsTypes';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(
    private readonly service: SkillsService,
    private readonly account: AccountsService,
  ) {}

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

  @Patch('/:student_id')
  @Version('1')
  @ApiOperation({
    description:
      'Add a skill to a student (or yourself). If the skill does not exists, create it and asign it.',
  })
  @ApiParam({
    name: 'student_id',
    type: 'uuid',
    required: false,
    description: 'If given, the student to which apply the skill',
  })
  @ApiBody({
    type: CreateSkillDto,
    required: true,
    description: 'The skill to find or create, then to apply.',
  })
  public async upsert(
    @Body()
    skill: CreateSkillDto,
    @Param('student_id')
    student_id?: string,
  ) {
    if (!student_id) throw new NotImplementedException();

    const student = await this.account.findModel(student_id, Student);
    if (!student) throw new NotFoundException();

    const found = await this.service.get(skill);
    if (found.length > 1)
      throw new InternalServerErrorException(
        'the query answered multiple skills.',
      );

    const upserted = await this.service.asign(found[0]?.id ?? skill, student);
    if (upserted instanceof HttpException) throw upserted;

    return upserted;
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
      "The student's id to which you want to apply the skill. If ommited, it applies to yourself.",
  })
  @ApiOperation({
    description: 'Apply a skill to a student or to yourself',
  })
  public async apply(
    @Param('id')
    id: number,
    @Param('student_id')
    student_id?: string,
  ) {
    if (!student_id) throw new NotImplementedException();

    const student = await this.account.findModel(student_id, Student);
    if (!student) throw new NotFoundException();

    const skill = await this.service.asign(id, student);
    if (skill instanceof HttpException) throw skill;

    return skill;
  }

  @Delete('/:id/:student_id')
  @Version('1')
  @ApiParam({
    name: 'id',
    description: 'The id of the skill to delete',
    required: true,
    type: 'number',
  })
  @ApiParam({
    name: 'student_id',
    required: false,
    type: 'uuid',
    description:
      "The student's id to which you want to delete the skill. If ommited, it deletes to yourself.",
  })
  @ApiOperation({
    description: 'Remove a skill to a student or to yourself',
  })
  public async remove(
    @Param('id')
    id: number,
    @Param('student_id')
    student_id?: string,
  ) {
    if (!student_id) throw new NotImplementedException();

    const student = await this.account.findModel(student_id, Student);
    if (!student) throw new NotFoundException();

    const skill = await this.service.remove(id, student);
    if (skill instanceof HttpException) throw skill;

    return skill;
  }
}
