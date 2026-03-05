import { Job } from 'src/jobs/entities/job.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('activity_domains')
export class ActivityDomain {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    type: Number,
  })
  id: number;

  @Column('varchar', {
    unique: true,
    length: 60,
  })
  @ApiProperty({
    type: 'string',
  })
  name: string;

  @Column('varchar', {
    nullable: true,
    length: 500,
  })
  @ApiProperty({ required: false, type: 'string' })
  description?: string;

  @OneToMany(() => Job, (job) => job.activity_domain, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  jobs: Relation<Job>[];
}
