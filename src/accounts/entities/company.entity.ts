import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ActivityDomain } from 'src/activity-domains/entities/activity-domain.entity';
import { Experience } from 'src/experiences/entities/experience.entity';
import { Job } from 'src/jobs/entities/job.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { LinkedToAccount } from './account.entity';

@Entity('companies')
export class Company extends LinkedToAccount {
  @PrimaryColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @Column('varchar', {
    length: 250,
  })
  @ApiProperty({
    type: 'string',
    maxLength: 250,
  })
  name: string;

  @Column('text', {
    default: "''",
  })
  @ApiProperty({
    type: 'string',
    format: 'html',
  })
  bio: string;

  @Column('date')
  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  creation_date: Date;

  @Column('varchar', {
    length: 500,
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    format: 'url',
    required: false,
  })
  scrapped_from?: string;

  @Column('varchar', {
    length: 200,
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    format: 'url',
    nullable: true,
    maxLength: 200,
  })
  website_url: string;

  @OneToMany(() => Job, (job) => job.company, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ApiProperty({
    type: () => Job,
    isArray: true,
  })
  jobs: Relation<Job>[];

  @OneToMany(() => Experience, (experience) => experience.company, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @ApiProperty({
    type: () => Experience,
    isArray: true,
  })
  referenced_experiences: Relation<Experience>[];

  @JoinColumn({
    name: 'activity_domain_id',
  })
  @ManyToOne(() => ActivityDomain, (activity) => activity.companies, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @ApiProperty({
    type: () => ActivityDomain,
  })
  activity_domain: Relation<ActivityDomain>;

  @Column()
  @Exclude()
  activity_domain_id: number;
}
