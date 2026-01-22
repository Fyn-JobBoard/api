import { Controller } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  create(createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  findAll() {
    return this.tagsService.findAll();
  }

  findOne(id: number) {
    return this.tagsService.findOne(id);
  }

  update(updateTagDto: UpdateTagDto) {
    return this.tagsService.update(updateTagDto.id, updateTagDto);
  }

  remove(id: number) {
    return this.tagsService.remove(id);
  }
}
