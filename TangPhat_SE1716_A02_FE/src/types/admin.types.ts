// Account Management Types
export interface Account {
  accountId: number;
  accountEmail: string;
  accountName: string;
  accountPassword?: string;
  accountRole: number;
  isActive?: boolean;
}

export interface CreateAccountRequest {
  accountEmail: string;
  accountName: string;
  accountPassword: string;
  accountRole: number;
  isActive?: boolean;
}

export interface UpdateAccountRequest {
  accountEmail: string;
  accountName: string;
  accountPassword?: string;
  accountRole: number;
  isActive?: boolean;
}

export interface UpdateProfileRequest {
  accountName: string;
  accountPassword?: string;
}

// Report Statistics Types
export interface NewsStatistic {
  newsArticleId: string;
  newsTitle: string;
  categoryName: string;
  createdDate: string;
  createdByName: string;
  newsStatus: boolean;
}

export interface ReportParams {
  startDate: string;
  endDate: string;
}

// Role Types
// Admin role = from appsettings (3), Staff = 1, Lecturer = 2
export enum AccountRole {
  Staff = 1,
  Lecturer = 2,
  Admin = 3
}

export const RoleNames: Record<AccountRole, string> = {
  [AccountRole.Staff]: 'Staff',
  [AccountRole.Lecturer]: 'Lecturer',
  [AccountRole.Admin]: 'Admin',
};

export const RoleColors: Record<AccountRole, string> = {
  [AccountRole.Staff]: 'bg-blue-100 text-blue-700 border-blue-200',
  [AccountRole.Lecturer]: 'bg-green-100 text-green-700 border-green-200',
  [AccountRole.Admin]: 'bg-red-100 text-red-700 border-red-200',
};
