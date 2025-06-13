export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// Simplified permissions for admin and user roles
export enum Permission {
  // Admin permissions
  MANAGE_USERS = 'manage:users', // Create, update, delete users
  MANAGE_ROLES = 'manage:roles', // Change user roles
  MANAGE_SYSTEM = 'manage:system', // System-wide settings

  // User permissions (also available to admin)
  MANAGE_OWN_PROJECTS = 'manage:own_projects', // CRUD on own projects
  MANAGE_PROJECT_MEMBERS = 'manage:project_members', // Add/remove project members
  MANAGE_SPRINTS = 'manage:sprints', // CRUD on sprints in owned projects
  MANAGE_WORK_ITEMS = 'manage:work_items', // CRUD on work items
  VIEW_PROJECTS = 'view:projects', // View all projects
  UPDATE_PROFILE = 'update:profile', // Update own profile
}
