import { Student } from 'src/accounts/entities/student.entity';
import { ActivityDomain } from 'src/activity-domains/entities/activity-domain.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('formations')
export class Formation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 200, nullable: true })
  info_url?: string;

  @Column('varchar', { length: 1024, nullable: true })
  description?: string;

  @Column('date', { nullable: true })
  obtention_date?: Date;

  /**
   * Stored as timestamp seconds
   */
  @Column('int')
  duration: number;

  @ManyToOne(() => Student, (student) => student.formations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => ActivityDomain, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_domain_id' })
  activity_domain?: ActivityDomain;
}
