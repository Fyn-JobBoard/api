import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn({})
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

  @Column('varchar', {
    length: 2048,
  })
  begin_date: string;
  @Column('date', {
    nullable: true,
  })
  end_date: string | null;

  @Column('uuid')
  student_id: string;

  @ManyToOne(() => require('../../accounts/entities/students.entity').Student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: any;

  @Column({ type: 'uuid', nullable: true })
  company_id?: string;

  @ManyToOne(() => require('../../companies/entities/company.entity').Company, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company?: any;

  @Column({ type: 'varchar', length: 70, nullable: true })
  company_fallback_name?: string;
}
