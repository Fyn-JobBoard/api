import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/accounts/entities/student.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private readonly skills: Repository<Skill>,
  ) {}

  public async get(predicate?: FindOptionsWhere<Skill>) {
    return this.skills.findBy(predicate ?? []);
  }
  public async find(id: number) {
    return this.skills.findOneBy({ id });
  }

  public async asign(
    skill: number | CreateSkillDto,
    to: Student,
  ): Promise<Skill | HttpException> {
    const final_skill = await (typeof skill === 'number'
      ? this.find(skill)
      : this.skills
          .upsert(skill, ['name', 'type'])
          .then((res) => this.find(+res.identifiers[0].id)));

    if (!final_skill) return new NotFoundException();

    if (!final_skill.students.find((student) => student.id === to.id)) {
      final_skill.students.push(to);
      await this.skills.save(final_skill);
    }

    return final_skill;
  }

  public async remove(skill: number, to: Student) {
    const found_skill = await this.find(skill);
    if (!found_skill) return new NotFoundException('skill not found');

    const student_index = found_skill.students.findIndex(
      (student) => student.id === to.id,
    );
    if (student_index < 0)
      return new NotFoundException('student does not have the given skill');

    found_skill.students.splice(student_index, 1);
    if (found_skill.students.length) {
      await this.skills.save(found_skill);
    } else {
      await this.skills.delete(found_skill.id);
    }

    return found_skill;
  }
}
