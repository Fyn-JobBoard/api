import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/accounts/entities/student.entity';
import { Repository } from 'typeorm';
import { SearchPredicates } from './class/search-predicates.class';
import { ActiveSearch } from './entities/active-search.entity';

@Injectable()
export class ActiveSearchesService {
  constructor(
    @InjectRepository(ActiveSearch)
    private readonly searches: Repository<ActiveSearch>,
  ) {}

  /**
   * List all active searches, or just a student's ones
   */
  public get(student?: Student) {
    if (student) {
      return this.searches.findBy({ student });
    }
    return this.searches.find();
  }
  /**
   * Find an active search by its id
   */
  public find(id: number) {
    return this.searches.findOneBy({
      id,
    });
  }

  /**
   * Create a new active search for the given student
   */
  public async create(for_student: Student, criterias: SearchPredicates) {
    const search = this.searches.create({
      criterias,
      student: for_student,
    });
    return this.searches.save(search);
  }

  /**
   * Delete all active searches for a student and return them
   */
  public async removeAll(of_student: Student) {
    const deleted = await this.get(of_student);
    await this.searches.delete({
      student: of_student,
    });

    return deleted;
  }
  /**
   * Delete a single active search and return it
   */
  public async delete(id: number) {
    const deleted = await this.find(id);
    if (!deleted) return new NotFoundException();
    await this.searches.delete({ id });

    return deleted;
  }
}
