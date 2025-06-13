import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Project } from 'src/project/entities/project.entity';
import type { WorkItem } from 'src/work-item/entities/work-item.entity';

export type SprintStatus = 'planned' | 'active' | 'completed';

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'enum', enum: ['planned', 'active', 'completed'] })
  public status: SprintStatus;

  @Column({ type: 'timestamp', nullable: true })
  public startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  public endDate?: Date;

  @Column({ type: 'varchar', nullable: true })
  public goal?: string;

  @ManyToOne('Project', {
    onDelete: 'CASCADE',
  })
  public project: Project;

  @OneToMany('WorkItem', 'sprint')
  public workItems: WorkItem[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
