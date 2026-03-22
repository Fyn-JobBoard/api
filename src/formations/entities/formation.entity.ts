import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Student } from 'src/accounts/entities/student.entity';
import { ActivityDomain } from 'src/activity-domains/entities/activity-domain.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('formations')
@ApiSchema()
export class Formation {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    type: 'number',
    minimum: 0,
  })
  id: number;

  @Column('varchar', { length: 100 })
  @ApiProperty({
    maxLength: 100,
  })
  title: string;

  @Column('varchar', { length: 200, nullable: true })
  @ApiProperty({
    required: false,
    maxLength: 200,
  })
  info_url?: string;

  @Column('varchar', { length: 1024, nullable: true })
  @ApiProperty({
    required: false,
    maxLength: 1024,
  })
  description?: string;

  @Column('date', { nullable: true })
  @ApiProperty({
    required: false,
    format: 'date',
  })
  obtention_date?: Date;

  /**
   * Stored as timestamp seconds
   */
  @Column('int')
  @ApiProperty({
    type: 'integer',
    minimum: 0,
    description: 'The duration of the formation (ms)',
  })
  duration: number;

  @ManyToOne(() => Student, (student) => student.formations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  @ApiProperty({
    type: () => Student,
  })
  student: Relation<Student>;

  @ManyToOne(() => ActivityDomain, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_domain_id' })
  @ApiProperty({
    type: () => ActivityDomain,
    required: false,
  })
  activity_domain?: Relation<ActivityDomain>;
}
