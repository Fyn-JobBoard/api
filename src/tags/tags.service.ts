import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagsRepository: Repository<Tag>) {}

  async create(createTagDto: { name: string }): Promise<Tag> {
    const tag = this.tagsRepository.create(createTagDto);
    return this.tagsRepository.save(tag);
  }

  findAll(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag #${id} not found`);
    }

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    Object.assign(tag, updateTagDto);
    return this.tagsRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagsRepository.remove(tag);
  }

  async findOrCreate(tagNames: string[]): Promise<Tag[]> {
    if (tagNames.length === 0) {
      return [];
    }

    const existingTags = await this.tagsRepository.findBy({
      name: In(tagNames),
    });
    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tagNames.filter(
      (name) => !existingTagNames.includes(name),
    );

    const newTags = newTagNames.map((name) =>
      this.tagsRepository.create({ name }),
    );

    const savedNewTags =
      newTags.length > 0 ? await this.tagsRepository.save(newTags) : [];

    return [...existingTags, ...savedNewTags];
  }
  async findExistingOrFail(tagNames: string[]): Promise<Tag[]> {
    if (!tagNames.length) return [];

    const tags = await this.tagsRepository.findBy({
      name: In(tagNames),
    });

    if (tags.length !== tagNames.length) {
      const foundNames = tags.map((t) => t.name);
      const missing = tagNames.filter((name) => !foundNames.includes(name));

      throw new NotFoundException(`Tag not found: ${missing.join(', ')}`);
    }

    return tags;
  }
}
