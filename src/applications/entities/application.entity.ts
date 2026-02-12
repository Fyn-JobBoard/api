import { ApplicationStatus } from 'src/common/enums/applicationStatus';
import { Job } from 'src/jobs/entities/job.entity';
import { Student } from 'src/accounts/entities/students.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 8192 })
  message: string;

  @Column('enum', {
    enum: ApplicationStatus,
    enumName: 'application_status',
    name: 'status',
    default: ApplicationStatus.Draft,
  })
  status: ApplicationStatus;

  @Column('uuid')
  student_id: string;

  @ManyToOne(() => Student, student => student.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column('uuid')
  job_id: string;

  @ManyToOne(() => Job, job => job.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
