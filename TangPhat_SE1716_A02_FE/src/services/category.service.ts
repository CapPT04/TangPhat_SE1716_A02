import { apiClient } from './api.service';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category.types';

export const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    return await apiClient.get<Category[]>('/Categories');
  },

  // Get active categories only
  getActive: async (): Promise<Category[]> => {
    return await apiClient.get<Category[]>('/Categories/active');
  },

  // Get category by ID
  getById: async (id: number): Promise<Category> => {
    return await apiClient.get<Category>(`/Categories/${id}`);
  },

  // Search categories
  search: async (searchTerm?: string): Promise<Category[]> => {
    return await apiClient.get<Category[]>(`/Categories/search?searchTerm=${searchTerm || ''}`);
  },

  // Create new category
  create: async (category: CreateCategoryRequest): Promise<Category> => {
    return await apiClient.post<Category>('/Categories', category);
  },

  // Update category
  update: async (id: number, category: UpdateCategoryRequest): Promise<Category> => {
    return await apiClient.put<Category>(`/Categories/${id}`, category);
  },

  // Delete category
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Categories/${id}`);
  },
};
