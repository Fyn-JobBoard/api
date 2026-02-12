import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('formations')
export class Formation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 200, nullable: true })
  info_url?: string;

  @Column('varchar', { length: 1024, nullable: true })
  description?: string;

  @Column('date', { nullable: true })
  obtention_date?: string;

  @Column('int', { comment: 'Stored as timestamp seconds' })
  duration: number;

  @Column('uuid')
  student_id: string;

  @Column('int', {
    nullable: true,
    comment: 'Null if no activity domain fit the formation',
  })
  activity_domain_id?: number;

  @ManyToOne(
    () =>
      require('../../activity-domains/entities/activity-domain.entity')
        .ActivityDomain,
    {
      nullable: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'activity_domain_id' })
  activity_domain?: any;
}
