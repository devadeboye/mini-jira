import { UserRole, Permission } from '../../user/enums/user.enum';

type RolePermissions = {
  [key in UserRole]: Permission[];
};

export const ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    Permission.MANAGE_USERS,
    Permission.MANAGE_ROLES,
    Permission.MANAGE_SYSTEM,
    Permission.MANAGE_OWN_PROJECTS,
    Permission.MANAGE_PROJECT_MEMBERS,
    Permission.MANAGE_SPRINTS,
    Permission.MANAGE_WORK_ITEMS,
    Permission.VIEW_PROJECTS,
    Permission.UPDATE_PROFILE,
  ],
  [UserRole.USER]: [
    // Regular user permissions
    Permission.MANAGE_OWN_PROJECTS,
    Permission.MANAGE_PROJECT_MEMBERS,
    Permission.MANAGE_SPRINTS,
    Permission.MANAGE_WORK_ITEMS,
    Permission.VIEW_PROJECTS,
    Permission.UPDATE_PROFILE,
  ],
};
