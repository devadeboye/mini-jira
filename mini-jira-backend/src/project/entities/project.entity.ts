import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import type { User } from 'src/user/entities/user.entity';
import type { Sprint } from 'src/sprint/entities/sprint.entity';
import type { WorkItem } from 'src/work-item/entities/work-item.entity';

export type ProjectType = 'scrum' | 'kanban';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'char', length: 10, unique: true })
  public key: string;

  @Column({ type: 'varchar', nullable: true })
  public description?: string;

  @Column({ type: 'varchar', nullable: true })
  public avatar?: string;

  @Column({ type: 'enum', enum: ['scrum', 'kanban'] })
  public type: ProjectType;

  @ManyToOne('User', {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public owner: User;

  @ManyToMany('User')
  @JoinTable({
    name: 'project_members',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  public members: User[];

  @OneToMany('Sprint', 'project')
  public sprints: Sprint[];

  @OneToMany('WorkItem', 'project')
  public workItems: WorkItem[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
