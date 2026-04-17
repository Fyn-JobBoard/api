import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/accounts/entities/student.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateFormationDto } from './dto/create-formation.dto';
import { UpdateFormationDto } from './dto/update-formation.dto';
import { Formation } from './entities/formation.entity';

@Injectable()
export class FormationsService {
  constructor(
    @InjectRepository(Formation)
    private readonly formations: Repository<Formation>,
  ) {}

  async create(createFormationDto: CreateFormationDto, student: Student) {
    const { identifiers } = await this.formations.insert({
      ...createFormationDto,
      student,
    });

    return this.formations.findOneByOrFail({
      id: identifiers[0].id as number,
    });
  }

  public async list(
    page: number = 1,
    per_page?: number,
    where?: FindOptionsWhere<Formation>,
  ) {
    if (per_page === undefined) {
      return {
        page: 1,
        pages: 1,
        list: await this.formations.find({
          where,
        }),
      };
    }
    const amount = await this.formations.count();
    return {
      page,
      pages: Math.ceil(amount / per_page),
      list: await this.formations.find({
        skip: per_page * (page - 1),
        take: per_page,
        where,
      }),
    };
  }

  findOne(id: number) {
    return this.formations.findOneBy({ id });
  }

  async update(id: number, updateFormationDto: UpdateFormationDto) {
    if (!(await this.formations.existsBy({ id }))) {
      return new NotFoundException();
    }

    await this.formations.update({ id }, updateFormationDto);
    return this.formations.findOneByOrFail({ id });
  }

  async remove(id: number) {
    const formation = await this.findOne(id);
    if (!formation) {
      return new NotFoundException();
    }

    await this.formations.delete(formation);

    return formation;
  }

  /**
   * Remove all formations of a student
   */
  async clear(student: Student) {
    const cleared = await this.list(undefined, undefined, {
      student,
    }).then((res) => res.list);
    await this.formations.delete({
      student,
    });

    return cleared;
  }
}
