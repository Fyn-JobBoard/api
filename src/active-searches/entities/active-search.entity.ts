import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';  

@Entity('active_searches')   
export class ActiveSearch {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({ type: 'json' })
    criterias: Record<string, any>;
}
