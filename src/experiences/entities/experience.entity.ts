import { Company } from 'src/accounts/entities/company.entity';
import { Student } from 'src/accounts/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    unique: true,
    length: 200,
  })
  title: string;

  @Column('varchar', {
    length: 100,
  })
  description: string;

  @Column('date')
  begin_date: Date;

  @Column('date', {
    nullable: true,
  })
  end_date?: Date;

  @ManyToOne(() => Student, (student) => student.experiences, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Company, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company?: Company;

  @Column({ type: 'varchar', length: 70, nullable: true })
  company_fallback_name?: string;
}
