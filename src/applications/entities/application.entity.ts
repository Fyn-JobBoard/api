import { Student } from 'src/accounts/entities/student.entity';
import { ApplicationStatus } from 'src/common/enums/applicationStatus';
import { Job } from 'src/jobs/entities/job.entity';
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

  @ManyToOne(() => Student, (student) => student.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Job, (job) => job.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
