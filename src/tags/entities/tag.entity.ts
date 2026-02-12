import { Job } from 'src/jobs/entities/job.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    unique: true,
    length: 50,
  })
  name: string;

  @ManyToMany(() => Job, (job) => job.tags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'job_tags',
    joinColumn: {
      name: 'job_id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
    },
  })
  jobs: Job[];
}
