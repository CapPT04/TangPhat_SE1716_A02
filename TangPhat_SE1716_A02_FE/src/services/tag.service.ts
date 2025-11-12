import { apiClient } from './api.service';
import { Tag, CreateTagRequest, UpdateTagRequest } from '@/types/news.types';

export const tagService = {
  // Get all tags
  getAll: async (): Promise<Tag[]> => {
    return await apiClient.get<Tag[]>('/Tags');
  },

  // Get tag by ID
  getById: async (id: number): Promise<Tag> => {
    return await apiClient.get<Tag>(`/Tags/${id}`);
  },

  // Search tags
  search: async (searchTerm?: string): Promise<Tag[]> => {
    return await apiClient.get<Tag[]>(`/Tags/search?searchTerm=${searchTerm || ''}`);
  },

  // Create new tag
  create: async (tag: CreateTagRequest): Promise<Tag> => {
    return await apiClient.post<Tag>('/Tags', tag);
  },

  // Update tag
  update: async (id: number, tag: UpdateTagRequest): Promise<Tag> => {
    return await apiClient.put<Tag>(`/Tags/${id}`, tag);
  },

  // Delete tag
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Tags/${id}`);
  },
};
