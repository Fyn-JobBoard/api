import {
  HttpException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/accounts/entities/student.entity';
import { Repository } from 'typeorm';
import { SearchPredicates } from './dto/search-predicates.dto';
import { ActiveSearch } from './entities/active-search.entity';

@Injectable()
export class ActiveSearchesService {
  protected static readonly V1_MAX_ACTIVE_SEARCH_PER_STUDENTS = 10;

  constructor(
    @InjectRepository(ActiveSearch)
    private readonly searches: Repository<ActiveSearch>,
  ) {}

  public async find(id: number, without_student_info = false) {
    const relations: string[] = [];
    if (!without_student_info) {
      relations.push('student');
    }

    return this.searches.findOne({ where: { id }, relations });
  }

  public async create(student: Student, criterias: SearchPredicates) {
    if (
      (await this.searches.countBy({ student })) >=
      ActiveSearchesService.V1_MAX_ACTIVE_SEARCH_PER_STUDENTS
    ) {
      return new NotAcceptableException(
        `The student #${student.id} cannot have more than ${ActiveSearchesService.V1_MAX_ACTIVE_SEARCH_PER_STUDENTS} active searches.`,
      );
    }

    return this.searches.save(this.searches.create({ student, criterias }));
  }

  public async update(
    search: number | ActiveSearch,
    criterias: SearchPredicates,
  ): Promise<ActiveSearch | HttpException> {
    const active_search =
      typeof search === 'number' ? await this.find(search) : search;

    if (!active_search) {
      return new NotFoundException();
    }

    active_search.criterias = criterias;
    return this.searches.save(active_search);
  }

  public async allOf(
    student: Student,
    without_student_info = false,
  ): Promise<ActiveSearch[]> {
    const relations: string[] = [];
    if (!without_student_info) {
      relations.push('student');
    }

    return this.searches.find({ where: { student }, relations });
  }
}
