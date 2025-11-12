// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accountId: number;
  accountName: string;
  accountEmail: string;
  accountRole: number;
  token: string;
}

export interface User {
  accountId: number;
  accountEmail: string;
  accountName: string;
  accountRole: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
