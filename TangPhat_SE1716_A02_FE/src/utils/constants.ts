export const APP_NAME = 'FU News Management System';
export const APP_DESCRIPTION = 'Hệ thống quản lý tin tức FPT University';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  NEWS: '/news',
  CATEGORIES: '/categories',
  TAGS: '/tags',
  ACCOUNTS: '/accounts',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    LOGOUT: '/Auth/logout',
  },
  NEWS: {
    LIST: '/News',
    DETAIL: (id: number) => `/News/${id}`,
    CREATE: '/News',
    UPDATE: (id: number) => `/News/${id}`,
    DELETE: (id: number) => `/News/${id}`,
  },
  CATEGORIES: {
    LIST: '/Categories',
    DETAIL: (id: number) => `/Categories/${id}`,
  },
  TAGS: {
    LIST: '/Tags',
    DETAIL: (id: number) => `/Tags/${id}`,
  },
} as const;

export const USER_ROLES = {
  ADMIN: 1,
  STAFF: 2,
  LECTURER: 3,
  STUDENT: 4,
} as const;

export const USER_ROLE_NAMES = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.STAFF]: 'Staff',
  [USER_ROLES.LECTURER]: 'Lecturer',
  [USER_ROLES.STUDENT]: 'Student',
} as const;
