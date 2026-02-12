import { Skill } from './skill.entity';
import { Student } from 'src/accounts/entities/students.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('student_skills')
export class StudentSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  skill_id: number;

  @ManyToOne(() => Skill, skill => skill.student_skills, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @Column('uuid')
  student_id: string;

  @ManyToOne(
    () => require('../../accounts/entities/students.entity').Student,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  )
  @JoinColumn({ name: 'student_id' })
  student: any;
}
