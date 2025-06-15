import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { Sprint } from '../../sprint/entities/sprint.entity';
import { User } from '../../user/entities/user.entity';
import {
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType,
} from '../enums/work-item.enum';

@Entity()
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({
    type: 'enum',
    enum: WorkItemType,
    default: WorkItemType.TASK,
  })
  public type: WorkItemType;

  @Column({
    type: 'enum',
    enum: WorkItemStatus,
    default: WorkItemStatus.TODO,
  })
  public status: WorkItemStatus;

  @Column({
    type: 'enum',
    enum: WorkItemPriority,
    default: WorkItemPriority.MEDIUM,
  })
  public priority: WorkItemPriority;

  @Column({ type: 'int', default: 0 })
  public storyPoints: number;

  @ManyToOne(() => Project, (project) => project.workItems)
  public project: Project;

  @ManyToOne(() => User, (user) => user.assignedWorkItems, { nullable: true })
  public assignee?: User;

  @ManyToOne(() => User, (user) => user.createdWorkItems)
  public creator: User;

  @ManyToOne(() => Sprint, (sprint) => sprint.workItems, { nullable: true })
  public sprint?: Sprint;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
