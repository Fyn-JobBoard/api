import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/accounts/entities/student.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './entities/experience.entity';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private readonly experiences: Repository<Experience>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto, student: Student) {
    const { identifiers } = await this.experiences.insert({
      ...createExperienceDto,
      student,
    });

    return this.experiences.findOneByOrFail({
      id: identifiers[0].id as number,
    });
  }

  public async list(
    page: number = 1,
    per_page?: number,
    where?: FindOptionsWhere<Experience>,
  ) {
    if (per_page === undefined) {
      return {
        page: 1,
        pages: 1,
        list: await this.experiences.find({
          where,
        }),
      };
    }
    const amount = await this.experiences.count();
    return {
      page,
      pages: Math.ceil(amount / per_page),
      list: await this.experiences.find({
        skip: per_page * (page - 1),
        take: per_page,
        where,
      }),
    };
  }

  findOne(id: number) {
    return this.experiences.findOneBy({ id });
  }

  async update(id: number, updateExperienceDto: UpdateExperienceDto) {
    if (!(await this.experiences.existsBy({ id }))) {
      return new NotFoundException();
    }

    await this.experiences.update({ id }, updateExperienceDto);
    return this.experiences.findOneByOrFail({ id });
  }

  async remove(id: number) {
    const experience = await this.findOne(id);
    if (!experience) {
      return new NotFoundException();
    }

    await this.experiences.delete(experience);

    return experience;
  }

  /**
   * Remove all experiences of a student
   */
  async clear(student: Student) {
    const cleared = await this.list(undefined, undefined, {
      student,
    }).then((res) => res.list);
    await this.experiences.delete({
      student,
    });

    return cleared;
  }
}
