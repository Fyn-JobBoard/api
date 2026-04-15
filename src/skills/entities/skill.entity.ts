import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Student } from 'src/accounts/entities/student.entity';
import { SkillTypes } from 'src/common/enums/skillsTypes';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    type: 'integer',
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

  @Column('enum', { enum: SkillTypes, enumName: 'skill_type' })
  @ApiProperty({
    enum: () => SkillTypes,
  })
  type: SkillTypes;

  @ManyToMany(() => Student, (student) => student.skills, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'student_skills',
    joinColumn: {
      name: 'student_id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
    },
  })
  @Exclude()
  students: Relation<Student>[];
}
