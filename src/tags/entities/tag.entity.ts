import { JobTag } from 'src/jobs/entities/job-tag.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    unique: true,
    length: 50,
  })
  name: string;

  @OneToMany(() => JobTag, jobTag => jobTag.tag)
  job_tags: JobTag[];
}
