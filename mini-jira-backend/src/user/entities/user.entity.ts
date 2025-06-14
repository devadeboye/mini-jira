import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole, UserStatus } from '../enums/user.enum';
import type { Project } from 'src/project/entities/project.entity';
import type { WorkItem } from 'src/work-item/entities/work-item.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', unique: true })
  public username: string;

  @Column({ type: 'varchar', unique: true })
  public email: string;

  @Column({ type: 'varchar', select: false })
  public password: string;

  @Column({ type: 'varchar', select: false })
  public salt: string;

  @Column({ type: 'varchar' })
  public fullName: string;

  @Column({ type: 'varchar', nullable: true })
  public avatar?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  public role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  public status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  public lastLoginAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  public lastActivityAt?: Date;

  @Column({ type: 'boolean', default: false })
  public hasCreatedProject: boolean;

  @OneToMany('Project', 'owner')
  public ownedProjects: Project[];

  @ManyToMany('Project', 'members')
  public projects: Project[];

  @OneToMany('WorkItem', 'assignee')
  public assignedWorkItems: WorkItem[];

  @OneToMany('WorkItem', 'creator')
  public createdWorkItems: WorkItem[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  updateLastActivity(): void {
    this.lastActivityAt = new Date();
  }
}
