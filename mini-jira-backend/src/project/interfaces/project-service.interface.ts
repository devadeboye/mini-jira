import { Project } from '../entities/project.entity';
import { User } from '../../user/entities/user.entity';

export interface ProjectService {
  create(data: { owner: User } & Record<string, any>): Promise<Project>;
  findAll(): Promise<Project[]>;
  findUserProjects(userId: string): Promise<Project[]>;
  findOne(id: string): Promise<Project>;
  findUserProject(id: string, userId: string): Promise<Project>;
  update(project: Project): Promise<Project>;
  updateUserProject(
    id: string,
    data: Record<string, any>,
    userId: string,
  ): Promise<Project>;
  remove(id: string): Promise<void>;
  removeUserProject(id: string, userId: string): Promise<void>;
  archiveProject(id: string): Promise<void>;
  getSystemStats(): Promise<Record<string, any>>;

  // Member management methods
  removeMember(
    projectId: string,
    userId: string,
    requesterId: string,
  ): Promise<Project>;
  getProjectMembers(projectId: string, userId: string): Promise<User[]>;
}
