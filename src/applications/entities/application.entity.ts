import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Student } from 'src/accounts/entities/student.entity';
import { ApplicationStatus } from 'src/common/enums/applicationStatus';
import { Job } from 'src/jobs/entities/job.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('applications')
@ApiSchema()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @Column({ type: 'varchar', length: 8192 })
  @ApiProperty({
    type: 'string',
    format: 'html',
  })
  message: string;

  @Column('enum', {
    enum: ApplicationStatus,
    enumName: 'application_status',
    name: 'status',
    default: ApplicationStatus.Draft,
  })
  @ApiProperty({
    enum: () => ApplicationStatus,
  })
  status: ApplicationStatus;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({
    type: 'string',
    format: 'url',
  })
  attachment: string;

  @ManyToOne(() => Student, (student) => student.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'student_id' })
  @ApiProperty({
    type: () => Student,
  })
  student: Relation<Student>;

  @ManyToOne(() => Job, (job) => job.applications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'job_id' })
  @ApiProperty({
    type: () => Job,
  })
  job: Relation<Job>;
}
