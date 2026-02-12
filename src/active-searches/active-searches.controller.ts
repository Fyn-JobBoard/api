import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActiveSearchesService } from './active-searches.service';
import { CreateActiveSearchDto } from './dto/create-active-search.dto';
import { UpdateActiveSearchDto } from './dto/update-active-search.dto';

@Controller('active-searches')
export class ActiveSearchesController {
  constructor(private readonly activeSearchesService: ActiveSearchesService) {}

  @Post()
  create(@Body() createActiveSearchDto: CreateActiveSearchDto) {
    return this.activeSearchesService.create(createActiveSearchDto);
  }

  @Get()
  findAll() {
    return this.activeSearchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activeSearchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActiveSearchDto: UpdateActiveSearchDto) {
    return this.activeSearchesService.update(+id, updateActiveSearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activeSearchesService.remove(+id);
  }
}
