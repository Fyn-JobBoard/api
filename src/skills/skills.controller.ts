import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
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
import { Account } from 'src/accounts/entities/account.entity';
import { Student } from 'src/accounts/entities/student.entity';
import { AuthAccount } from 'src/auth/decorators/getters/account/account.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Permissions } from 'src/common/enums/Permissions';
import { SkillTypes } from 'src/common/enums/skillsTypes';
import { CreateSkillDto } from './dto/create-skill.dto';
import { ListSkillsDto } from './dto/list-skills.response.dto';
import { Skill } from './entities/skill.entity';
import { SkillsService } from './skills.service';

@Controller('skills')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description:
    'Your request is bad constructed (Note that you must be logged to use this route)',
})
@UseGuards(IsLoggedGuard)
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
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'integer',
    minimum: 1,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    type: 'integer',
    minimum: 1,
  })
  @ApiOperation({
    description: 'Find skills based on their name and/or type',
  })
  @ApiOkResponse({
    type: ListSkillsDto,
  })
  public async get(
    @Query('page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    page: number,

    @Query('per_page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    per_page: number,

    @Query('name')
    name?: string,
    @Query('type')
    type?: SkillTypes,
  ) {
    return this.service.list(
      isNaN(page) ? undefined : page,
      isNaN(per_page) ? 20 : per_page,
      { name, type },
    );
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
  @ApiOkResponse({
    type: Skill,
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
      'Add skills to a student (or yourself). If the skill does not exists, create it and asign it.',
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
  @ApiOkResponse({
    type: Skill,
  })
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_STUDENTS),
  })
  public async upsert(
    @Body()
    skill: CreateSkillDto,

    @AuthAccount()
    auth: Account,

    @Param('student_id')
    student_id?: string,
  ) {
    const student = await this.account.findModel(
      student_id ?? auth.id,
      Student,
    );
    if (!student)
      throw new NotFoundException(
        'Student not found or provided id is not a student.',
      );

    if (!(auth.type === AccountTypes.Admin || auth.id === student.id)) {
      throw new UnauthorizedException();
    }

    const found = (await this.service.list(undefined, undefined, skill)).list;
    if (found.length > 1)
      throw new InternalServerErrorException(
        'The query answered multiple skills.',
      );

    const upserted = await this.service.asign(found[0]?.id ?? skill, student);
    if (upserted instanceof HttpException) {
      throw upserted;
    }

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
  @ApiOkResponse({
    type: Skill,
  })
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_STUDENTS),
  })
  public async apply(
    @Param('id')
    id: number,

    @AuthAccount()
    auth: Account,

    @Param('student_id')
    student_id?: string,
  ) {
    const student = await this.account.findModel(
      student_id ?? auth.id,
      Student,
    );
    if (!student)
      throw new NotFoundException(
        'Student not found or provided id is not a student.',
      );

    if (!(auth.type === AccountTypes.Admin || auth.id === student.id)) {
      throw new UnauthorizedException();
    }

    const skill = await this.service.asign(id, student);
    if (skill instanceof HttpException) {
      throw skill;
    }

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
  @ApiOkResponse({
    type: Skill,
    description: 'The skill that as been just deleted to the student.',
  })
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_STUDENTS),
  })
  public async remove(
    @Param('id')
    id: number,

    @AuthAccount()
    auth: Account,

    @Param('student_id')
    student_id?: string,
  ) {
    const student = await this.account.findModel(
      student_id ?? auth.id,
      Student,
    );
    if (!student)
      throw new NotFoundException(
        'Student not found or provided id is not a student.',
      );

    if (!(auth.type === AccountTypes.Admin || auth.id === student.id)) {
      throw new UnauthorizedException();
    }

    const skill = await this.service.remove(id, student);
    if (skill instanceof HttpException) throw skill;

    return skill;
  }
}
