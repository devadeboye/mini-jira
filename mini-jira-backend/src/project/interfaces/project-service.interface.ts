import { Project } from '../entities/project.entity';

export interface ProjectService {
  create(data: { ownerId: string } & Record<string, any>): Promise<Project>;
  findAll(): Promise<Project[]>;
  findUserProjects(userId: string): Promise<Project[]>;
  findOne(id: string): Promise<Project>;
  findUserProject(id: string, userId: string): Promise<Project>;
  update(id: string, data: Record<string, any>): Promise<Project>;
  updateUserProject(
    id: string,
    data: Record<string, any>,
    userId: string,
  ): Promise<Project>;
  remove(id: string): Promise<void>;
  removeUserProject(id: string, userId: string): Promise<void>;
  archiveProject(id: string): Promise<void>;
  getSystemStats(): Promise<Record<string, any>>;
}
