import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  NotImplementedException,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger';
import { AccountsService } from 'src/accounts/accounts.service';
import { ActiveSearchesService } from './active-searches.service';

@Controller('searches')
export class ActiveSearchesController {
  constructor(
    private readonly service: ActiveSearchesService,
    private readonly accounts: AccountsService,
  ) {}

  @Get('/:search_id')
  @ApiProperty({
    description: 'Get a single active search.',
  })
  @ApiParam({
    name: 'search_id',
    description: 'The id of the active search',
    required: true,
    type: 'string',
  })
  public async get(
    @Param('search_id')
    search_id: string,
  ) {
    const id = parseInt(search_id);
    if (isNaN(id))
      throw new BadRequestException('search_id must be an integer.');

    const search = await this.service.find(id);
    if (!search) throw new NotFoundException();
    return search;
  }

  @Delete('/:search_id')
  @ApiProperty({
    description: 'Delete a single active search.',
  })
  @ApiParam({
    name: 'search_id',
    description: 'The id of the active search to delete',
    required: true,
  })
  public async delete(
    @Param('search_id')
    search_id: string,
  ) {
    const id = parseInt(search_id);
    if (isNaN(id))
      throw new BadRequestException('search_id must be an integer.');

    const deleted = await this.service.delete(id);
    if (deleted instanceof HttpException) throw deleted;

    return deleted;
  }

  // ---- For students ---- \\

  @Get('/student/:student_id')
  @ApiOperation({
    description:
      'Get all the active searches for the given student or the connected one.',
  })
  @ApiParam({
    name: 'student_id',
    required: false,
    type: 'uuid',
    description: 'The student id of which you want to get the active searches.',
  })
  public for(
    @Param('student_id')
    student_id: string,
  ) {
    throw new NotImplementedException();
  }

  @Delete('/student/:student_id')
  @ApiOperation({
    description:
      'Delete all the active searches of the given student or the connected one.',
  })
  @ApiParam({
    name: 'student_id',
    required: false,
    type: 'uuid',
    description:
      'The student id of which you want to delete the active searches.',
  })
  public clear(
    @Param('student_id')
    student_id: string,
  ) {
    throw new NotImplementedException();
  }
}
