import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private readonly tags: Repository<Tag>) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    const tag = this.tags.create(dto);
    return this.tags.save(tag);
  }

  async search(query: PaginationQueryDto & { search?: string }): Promise<{
    items: Tag[];
    page: number;
    pages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where = query.search?.trim()
      ? { name: ILike(`%${query.search.trim()}%`) }
      : {};

    const [items, total] = await this.tags.findAndCount({
      where,
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOneBy(id: number): Promise<Tag | null> {
    return this.tags.findOneBy({ id });
  }

  async update(
    id: number,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag | HttpException> {
    if (!(await this.tags.exists({ where: { id } }))) {
      return new NotFoundException();
    }
    await this.tags.update({ id }, updateTagDto);
    return (await this.findOneBy(id))!;
  }

  async removeFromJob(
    tagId: number,
    jobId: string,
  ): Promise<Tag | HttpException> {
    const tag = await this.tags.findOne({
      where: { id: tagId },
      relations: ['jobs'],
    });
    if (!tag) return new NotFoundException();

    tag.jobs = tag.jobs.filter((job) => job.id !== jobId);

    await this.tags.save(tag);
    return tag;
  }

  async upsert(...tags: CreateTagDto[]): Promise<Tag[]> {
    const values = tags.map((tag) => ({
      ...tag,
      name: tag.name.trim(),
    }));
    await this.tags.upsert(values, ['name']);

    return this.tags.find({
      where: { name: In(values.map((tag) => tag.name)) },
      order: { name: 'ASC' },
    });
  }
}
