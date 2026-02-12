import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import type { SkillTypes } from 'src/common/enums/skillsTypess';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Get('/')
  public async get(
    @Query('name')
    name?: string,
    @Query('type')
    type?: SkillTypes,
  ) {
    return this.service.get({ name, type });
  }

  @Get('/:id')
  public async find(
    @Param('id')
    id: number,
  ) {
    const found = await this.service.find(id);
    if (!found) throw new NotFoundException();

    return found;
  }
}
