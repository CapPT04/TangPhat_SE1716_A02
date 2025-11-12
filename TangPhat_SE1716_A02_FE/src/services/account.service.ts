import { apiClient } from './api.service';
import { Account, CreateAccountRequest, UpdateAccountRequest, UpdateProfileRequest } from '@/types/admin.types';

export const accountService = {
  // Get all accounts (Admin only)
  getAll: async (): Promise<Account[]> => {
    return await apiClient.get<Account[]>('/Accounts');
  },

  // Get account by ID
  getById: async (id: number): Promise<Account> => {
    return await apiClient.get<Account>(`/Accounts/${id}`);
  },

  // Search accounts
  search: async (searchTerm?: string): Promise<Account[]> => {
    return await apiClient.get<Account[]>(`/Accounts/search?searchTerm=${searchTerm || ''}`);
  },

  // Create new account (Admin only)
  create: async (account: CreateAccountRequest): Promise<Account> => {
    return await apiClient.post<Account>('/Accounts', account);
  },

  // Update account (Admin only)
  update: async (id: number, account: UpdateAccountRequest): Promise<Account> => {
    return await apiClient.put<Account>(`/Accounts/${id}`, account);
  },

  // Delete account (Admin only - with special logic)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Accounts/${id}`);
  },

  // Update own profile
  updateProfile: async (profile: UpdateProfileRequest): Promise<Account> => {
    return await apiClient.put<Account>('/Accounts/profile', profile);
  },
};
