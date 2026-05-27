import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ActiveSearch } from 'src/active-searches/entities/active-search.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Experience } from 'src/experiences/entities/experience.entity';
import { Formation } from 'src/formations/entities/formation.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { LinkedToAccount } from './account.entity';

@Entity('students')
export class Student extends LinkedToAccount {
  @PrimaryColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @Column('varchar', { length: 200 })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
  })
  first_name: string;

  @Column('varchar', { length: 200 })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
  })
  last_name: string;

  @Column('date')
  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  birthdate: Date;

  @Column('text', {
    default: "''",
  })
  @ApiProperty({
    type: 'string',
    format: 'html',
  })
  bio: string;

  @Column('varchar', {
    array: true,
    length: 200,
  })
  @ApiProperty({
    type: 'string',
    format: 'url',
    isArray: true,
  })
  links: string[];

  @OneToMany(() => Application, (application) => application.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Exclude()
  applications: Relation<Application>[];

  @OneToMany(() => ActiveSearch, (search) => search.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Exclude()
  activeSearches: Relation<ActiveSearch>[];

  @OneToMany(() => Experience, (experience) => experience.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Exclude()
  experiences: Relation<Experience>[];

  @OneToMany(() => Formation, (formation) => formation.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Exclude()
  formations: Relation<Formation>[];

  @ManyToMany(() => Skill, (skill) => skill.students, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'student_skills',
    joinColumn: {
      name: 'skill_id',
    },
    inverseJoinColumn: {
      name: 'student_id',
    },
  })
  @Exclude()
  skills: Relation<Skill>[];
}
