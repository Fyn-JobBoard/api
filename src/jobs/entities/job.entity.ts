import { Company } from 'src/accounts/entities/company.entity';
import { ActivityDomain } from 'src/activity-domains/entities/activity-domain.entity';
import { Application } from 'src/applications/entities/application.entity';
import { ContractTypes } from 'src/common/enums/contractTypes';
import { Languages } from 'src/common/enums/languages';
import { RemunerationPeriods } from 'src/common/enums/remunerationPeriods';
import { WorkingModes } from 'src/common/enums/workingModes';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
  })
  title: string;

  @Column('varchar', {
    length: 4096,
  })
  description: string;

  @Column('varchar', {
    length: 250,
    nullable: true,
  })
  apply_link?: string;

  @Column('enum', {
    enum: Languages,
    enumName: 'language',
    array: true,
  })
  languages: Languages[];

  @Column('decimal', {
    scale: 4,
    precision: 6,
    nullable: true,
  })
  lat?: number;

  @Column('decimal', {
    precision: 7,
    scale: 4,
    nullable: true,
  })
  lng?: number;

  @Column('enum', {
    enum: WorkingModes,
    enumName: 'work_mode',
    name: 'mode',
  })
  mode: WorkingModes;

  @Column('varchar', {
    length: 200,
    nullable: true,
  })
  scrapped_from?: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  remuneration: number;

  @Column('enum', {
    enum: RemunerationPeriods,
    enumName: 'remuneration_period',
    default: RemunerationPeriods.Single,
  })
  remuneration_period: RemunerationPeriods;

  @Column('enum', {
    enum: ContractTypes,
    enumName: 'work_contract',
  })
  contract: ContractTypes;

  @Column('date', {
    nullable: true,
  })
  period_start?: Date;

  /**
   * Stored as timestamp seconds
   */
  @Column('int', {
    unsigned: true,
  })
  period_duration: number;

  /**
   * Stored as timestamp seconds
   */
  @Column('int', {
    unsigned: true,
    nullable: true,
  })
  min_formation_duration?: number;

  @Column('boolean', {
    default: false,
  })
  active: boolean;

  @Column('varchar', {
    length: 1024,
    nullable: true,
  })
  moderation_feedback?: string;

  @ManyToOne(() => ActivityDomain, (activityDomain) => activityDomain.jobs, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_domain_id' })
  activity_domain: Relation<ActivityDomain>;

  @ManyToOne(() => Company, (company) => company.jobs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Relation<Company>;

  @OneToMany(() => Application, (application) => application.job, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  applications: Relation<Application>[];

  @ManyToMany(() => Tag, (tag) => tag.jobs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'job_tags',
    joinColumn: {
      name: 'tag_id',
    },
    inverseJoinColumn: {
      name: 'job_id',
    },
  })
  tags: Relation<Tag>[];
}
