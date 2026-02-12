import { Tag } from 'src/tags/entities/tag.entity';
import { Job } from './job.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('job_tags')
export class JobTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  tag_id: number;

  @ManyToOne(() => Tag, tag => tag.job_tags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @Column('uuid')
  job_id: string;
}
