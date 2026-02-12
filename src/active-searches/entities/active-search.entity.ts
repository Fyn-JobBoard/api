import { Student } from 'src/accounts/entities/students.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { SearchPredicates } from '../types/search';

@Entity('active_searches')
export class ActiveSearch {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'json' })
  criterias: SearchPredicates;
}
