import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Company } from 'src/accounts/entities/company.entity';
import { Student } from 'src/accounts/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('experiences')
@ApiSchema()
export class Experience {
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

  @Column('varchar', { length: 2048 })
  @ApiProperty({
    maxLength: 2048,
  })
  description: string;

  @Column('date')
  @ApiProperty({
    format: 'date',
  })
  begin_date: Date;

  @Column('date', { nullable: true })
  @ApiProperty({
    format: 'date',
    required: false,
  })
  end_date?: Date;

  @ManyToOne(() => Student, (student) => student.experiences, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  @ApiProperty({
    type: () => Student,
  })
  student: Relation<Student>;

  @ManyToOne(() => Company, (company) => company.referenced_experiences, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  @ApiProperty({
    type: () => Company,
    required: false,
  })
  company?: Relation<Company>;

  @Column('varchar', { length: 70, nullable: true, default: "''" })
  @ApiProperty({
    required: false,
    maxLength: 70,
  })
  company_fallback_name?: string;
}
