import { Injectable } from '@nestjs/common';
import { CreateActiveSearchDto } from './dto/create-active-search.dto';
import { UpdateActiveSearchDto } from './dto/update-active-search.dto';

@Injectable()
export class ActiveSearchesService {
  create(createActiveSearchDto: CreateActiveSearchDto) {
    return 'This action adds a new activeSearch';
  }

  findAll() {
    return `This action returns all activeSearches`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activeSearch`;
  }

  update(id: number, updateActiveSearchDto: UpdateActiveSearchDto) {
    return `This action updates a #${id} activeSearch`;
  }

  remove(id: number) {
    return `This action removes a #${id} activeSearch`;
  }
}
