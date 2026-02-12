import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(id: number) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  update(updateTagDto: UpdateTagDto) {
    return this.tagsService.update(updateTagDto.id, updateTagDto);
  }

  @Delete(':id')
  remove(id: number) {
    return this.tagsService.remove(id);
  }
}
