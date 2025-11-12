export const ROLES = {
  ADMIN: 1,
  STAFF: 2,
  LECTURER: 3,
  STUDENT: 4,
} as const;

export const ROLE_NAMES: Record<number, string> = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.STAFF]: 'Staff',
  [ROLES.LECTURER]: 'Lecturer',
  [ROLES.STUDENT]: 'Student',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7777/api';
