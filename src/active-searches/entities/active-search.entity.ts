import { Student } from 'src/accounts/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import type { SearchPredicates } from '../types/search';

@Entity('active_searches')
export class ActiveSearch {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Student, (student) => student.activeSearches, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Relation<Student>;

  @Column({ type: 'json' })
  criterias: SearchPredicates;
}
