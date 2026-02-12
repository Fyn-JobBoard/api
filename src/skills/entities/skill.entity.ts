import { Student } from 'src/accounts/entities/student.entity';
import { SkillTypes } from 'src/common/enums/skillsTypess';
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
  id: number;

  @Column('varchar', {
    unique: true,
    length: 60,
  })
  name: string;

  @Column('enum', { enum: SkillTypes, enumName: 'skill_type' })
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
  students: Relation<Student>[];
}
