import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
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
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Permissions } from 'src/common/enums/permissions';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { ListExperiencesResponseDto } from './dto/list-experience-response.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './entities/experience.entity';
import { ExperiencesService } from './experiences.service';

@Controller('experiences')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access this resources.',
})
export class ExperiencesController {
  constructor(
    private readonly experiences: ExperiencesService,
    private readonly accounts: AccountsService,
  ) {}

  @Post('/')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Student])
  @Version('1')
  @ApiOperation({
    description:
      'Create a new experience and asign it to yourself (only available for students)',
  })
  @ApiOkResponse({
    type: Experience,
  })
  async create(
    @Body()
    experienceDto: CreateExperienceDto,
    @AuthAccount()
    auth: Account,
  ) {
    return this.createFor(experienceDto, auth.id, auth);
  }

  @Post('/of/:student_id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_EXPERIENCES),
  })
  @ApiParam({
    name: 'student_id',
    description:
      'The id of the student you want to asign the new experience to.',
  })
  @ApiOperation({
    description: 'Create a new experience',
  })
  @ApiOkResponse({
    type: Experience,
  })
  async createFor(
    @Body()
    experienceDto: CreateExperienceDto,
    @Param('student_id')
    student_id: string,
    @AuthAccount()
    auth: Account,
  ) {
    const student = await this.accounts.findModel(student_id, Student);
    if (!student) {
      throw new NotFoundException(`Student #${student_id} does not exists.`);
    }

    if (
      ![AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) &&
      student.id !== auth.id
    ) {
      throw new UnauthorizedException();
    }

    return this.experiences.create(experienceDto, student);
  }

  @Get('/')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Student])
  @Version('1')
  @ApiOperation({
    description: 'Get all your experiences (only available for students)',
  })
  @ApiOkResponse({
    type: ListExperiencesResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page shift',
    type: 'integer',
    minimum: 1,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    description: 'The amount of items you want in a page',
    type: 'integer',
    minimum: 1,
  })
  async list(
    @AuthAccount()
    auth: Account,

    @Query('page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    page: number,
    @Query('per_page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    per_page: number,
  ) {
    return this.listFor(auth.id, page, per_page);
  }

  @Get('/of/:student_id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.VIEW_EXPERIENCES),
  })
  @ApiParam({
    name: 'student_id',
    description: 'The id of the student you want to view the experiences.',
  })
  @ApiOperation({
    description: 'View all experiences of a student',
  })
  @ApiOkResponse({
    type: ListExperiencesResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page shift',
    type: 'integer',
    minimum: 1,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    description: 'The amount of items you want in a page',
    type: 'integer',
    minimum: 1,
  })
  async listFor(
    @Param('student_id')
    student_id: string,

    @Query('page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    page: number,
    @Query('per_page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    per_page: number,
  ) {
    const student = await this.accounts.findModel(student_id, Student);
    if (!student) {
      throw new NotFoundException(`Student #${student_id} does not exists.`);
    }

    return this.experiences.list(
      isNaN(page) ? undefined : Math.max(1, page),
      isNaN(per_page) ? 20 : Math.max(1, per_page),
      {
        student,
      },
    );
  }

  @Get('/:experience_id')
  @ApiOperation({
    description: 'Get a single experience',
  })
  @ApiOkResponse({
    type: Experience,
  })
  @ApiParam({
    name: 'experience_id',
    description: 'The experience id you want to retreive',
    type: 'integer',
  })
  @Version('1')
  @UseGuards(IsLoggedGuard)
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.VIEW_EXPERIENCES),
  })
  public async single(
    @Param('experience_id', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    experience_id: number,
  ) {
    if (isNaN(experience_id)) {
      throw new BadRequestException('experience_id must be an integer');
    }

    const found = await this.experiences.findOne(experience_id);
    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  @Put('/:experience_id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_EXPERIENCES),
  })
  @ApiOperation({
    description: 'Modify an existing experience',
  })
  @ApiOkResponse({
    type: Experience,
  })
  async update(
    @Body()
    experienceDto: UpdateExperienceDto,
    @AuthAccount()
    auth: Account,
    @Param('experience_id', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    experience_id: number,
  ) {
    if (isNaN(experience_id)) {
      throw new BadRequestException(
        'experience_id must be a positive integer.',
      );
    }

    const experience = await this.experiences.findOne(experience_id);
    if (!experience) {
      throw new NotFoundException();
    }

    if (
      ![AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) &&
      auth.id !== experience.student.id
    ) {
      throw new UnauthorizedException();
    }

    const result = await this.experiences.update(experience.id, experienceDto);
    if (result instanceof HttpException) {
      throw result;
    }

    return result;
  }
}
