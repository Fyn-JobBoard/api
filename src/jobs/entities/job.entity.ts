import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @Column('varchar', {
    length: 100,
  })
  @ApiProperty({
    type: 'string',
  })
  title: string;

  @Column('varchar', {
    length: 4096,
  })
  @ApiProperty({
    type: 'string',
    format: 'html',
  })
  description: string;

  @Column('varchar', {
    length: 250,
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    format: 'url',
    required: false,
  })
  apply_link?: string;

  @Column('enum', {
    enum: Languages,
    array: true,
  })
  @ApiProperty({
    enum: Languages,
    isArray: true,
  })
  languages: Languages[];

  @Column('decimal', {
    scale: 4,
    precision: 6,
    nullable: true,
  })
  @ApiProperty({
    type: 'number',
    minimum: 0,
    maximum: 90,
    required: false,
  })
  lat?: number;

  @Column('decimal', {
    precision: 7,
    scale: 4,
    nullable: true,
  })
  @ApiProperty({
    type: 'number',
    minimum: -180,
    maximum: 180,
    required: false,
  })
  lng?: number;

  @Column('enum', {
    enum: WorkingModes,
    name: 'mode',
  })
  @ApiProperty({
    enum: WorkingModes,
  })
  mode: WorkingModes;

  @Column('varchar', {
    length: 200,
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    format: 'url',
    required: false,
  })
  scrapped_from?: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @ApiProperty({
    type: 'number',
    minimum: 0,
  })
  remuneration: number;

  @Column('enum', {
    enum: RemunerationPeriods,
    default: RemunerationPeriods.Single,
  })
  @ApiProperty({
    enum: RemunerationPeriods,
  })
  remuneration_period: RemunerationPeriods;

  @Column('enum', {
    enum: ContractTypes,
  })
  @ApiProperty({
    enum: ContractTypes,
  })
  contract: ContractTypes;

  @Column('date', {
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    format: 'date',
    required: false,
  })
  period_start?: Date;

  /**
   * Stored as timestamp seconds
   */
  @Column('int', {
    unsigned: true,
  })
  @ApiProperty({
    type: 'number',
    minimum: 0,
  })
  period_duration: number;

  /**
   * Stored as timestamp seconds
   */
  @Column('int', {
    unsigned: true,
    nullable: true,
  })
  @ApiProperty({
    type: 'integer',
    minimum: 0,
    required: false,
  })
  min_formation_duration?: number;

  @Column('boolean', {
    default: false,
  })
  @ApiProperty({
    type: 'boolean',
  })
  active: boolean;

  @Column('varchar', {
    length: 1024,
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    required: false,
  })
  moderation_feedback?: string;

  @ManyToOne(() => ActivityDomain, (activityDomain) => activityDomain.jobs, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'activity_domain_id' })
  @ApiProperty({
    type: () => ActivityDomain,
  })
  activity_domain: Relation<ActivityDomain>;

  @Column()
  @Exclude()
  activity_domain_id: number;

  @ManyToOne(() => Company, (company) => company.jobs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'company_id' })
  @ApiProperty({
    type: () => Company,
  })
  company: Relation<Company>;

  @Column()
  @Exclude()
  company_id: string;

  @OneToMany(() => Application, (application) => application.job, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Exclude()
  applications: Relation<Application>[];

  @ManyToMany(() => Tag, (tag) => tag.jobs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
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
  @ApiProperty({
    type: () => Tag,
    isArray: true,
  })
  tags: Relation<Tag>[];
}
