import { SkillTypes } from 'src/common/enums/skillsTypess';
import { StudentSkill } from './student-skill.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        unique: true,
        length: 60,
    })
    name: string;

    @Column('enum', { enum: SkillTypes, enumName: 'skill_type' })
    type: SkillTypes;

    @OneToMany(() => StudentSkill, studentSkill => studentSkill.skill)
    student_skills: StudentSkill[];
}
