import { ApiProperty } from '@nestjs/swagger';
import { Student } from 'src/accounts/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { SearchPredicates } from '../class/search-predicates.class';

@Entity('active_searches')
export class ActiveSearch {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Student, (student) => student.activeSearches, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  @ApiProperty({
    type: () => Student,
  })
  student: Relation<Student>;

  @Column({ type: 'json' })
  @ApiProperty({
    type: () => SearchPredicates,
  })
  criterias: SearchPredicates;
}
