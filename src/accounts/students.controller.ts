import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountsService } from './accounts.service';
import { ListStudentsResponseDto } from './dto/students/list-students.response.dto';
import { Student } from './entities/student.entity';

@Controller('accounts/students')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access to this resource.',
})
export class StudentsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/')
  @UseGuards(IsLoggedGuard)
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
  @ApiOkResponse({
    type: ListStudentsResponseDto,
  })
  @Version('1')
  public list(
    @Query('page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    page: number,
    @Query('per_page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    per_page: number,
  ) {
    return this.accountsService.listOf(
      Student,
      isNaN(page) ? undefined : Math.max(1, page),
      isNaN(per_page) ? 20 : Math.max(1, per_page),
    );
  }

  @Get('/:id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @ApiOkResponse({
    type: Student,
  })
  @ApiParam({
    type: 'string',
    format: 'uuid',
    required: true,
    name: 'id',
  })
  public async get(
    @Param('id')
    id: string,
  ) {
    const student = await this.accountsService.findModel(id, Student);
    if (!student) {
      throw new NotFoundException();
    }

    return student;
  }
}
