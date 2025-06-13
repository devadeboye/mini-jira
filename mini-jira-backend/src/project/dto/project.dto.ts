export interface CreateProjectDto {
  name: string;
  key: string;
  description?: string;
  type: 'scrum' | 'kanban';
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  type?: 'scrum' | 'kanban';
}
