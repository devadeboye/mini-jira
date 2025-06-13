import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Project } from 'src/project/entities/project.entity';
import type { Sprint } from 'src/sprint/entities/sprint.entity';
import type { User } from 'src/user/entities/user.entity';

export type WorkItemType = 'story' | 'task' | 'bug' | 'epic';
export type WorkItemStatus = 'todo' | 'in-progress' | 'done';
export type WorkItemPriority = 'highest' | 'high' | 'medium' | 'low' | 'lowest';

@Entity()
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public title: string;

  @Column({ type: 'enum', enum: ['story', 'task', 'bug', 'epic'] })
  public type: WorkItemType;

  @Column({ type: 'enum', enum: ['todo', 'in-progress', 'done'] })
  public status: WorkItemStatus;

  @Column({
    type: 'enum',
    enum: ['highest', 'high', 'medium', 'low', 'lowest'],
  })
  public priority: WorkItemPriority;

  @Column({ type: 'text', nullable: true })
  public description?: string;

  @Column({ type: 'int' })
  public estimate: number;

  @Column({ type: 'int' })
  public order: number;

  @ManyToOne('User', {
    nullable: true,
    onDelete: 'SET NULL',
  })
  public assignee?: User;

  @ManyToOne('User', {
    onDelete: 'CASCADE',
  })
  public createdBy: User;

  @ManyToOne('Project', {
    onDelete: 'CASCADE',
  })
  public project: Project;

  @ManyToOne('Sprint', {
    nullable: true,
    onDelete: 'SET NULL',
  })
  public sprint?: Sprint;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
