import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Skill } from './skill.entity';

@Entity('student_skills')
export class StudentSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  skill_id: number;

  @ManyToOne(() => Skill, (skill) => skill.student_skills, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @Column('uuid')
  student_id: string;

  @ManyToOne(() => require('../../accounts/entities/students.entity').Student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: any;
}
