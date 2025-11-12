import { apiClient } from './api.service';
import { NewsArticle, CreateNewsArticleRequest, UpdateNewsArticleRequest } from '@/types/news.types';

export const newsService = {
  // Get all news articles (Staff only)
  getAll: async (): Promise<NewsArticle[]> => {
    return await apiClient.get<NewsArticle[]>('/News');
  },

  // Get active news articles (Public)
  getActive: async (): Promise<NewsArticle[]> => {
    return await apiClient.get<NewsArticle[]>('/News/active');
  },

  // Get news by current user (Staff only)
  getMyNews: async (): Promise<NewsArticle[]> => {
    return await apiClient.get<NewsArticle[]>('/News/my-news');
  },

  // Get news article by ID
  getById: async (id: number): Promise<NewsArticle> => {
    return await apiClient.get<NewsArticle>(`/News/${id}`);
  },

  // Search news articles
  search: async (searchTerm?: string): Promise<NewsArticle[]> => {
    return await apiClient.get<NewsArticle[]>(`/News/search?searchTerm=${searchTerm || ''}`);
  },

  // Create new news article
  create: async (news: CreateNewsArticleRequest): Promise<NewsArticle> => {
    return await apiClient.post<NewsArticle>('/News', news);
  },

  // Update news article
  update: async (id: number, news: UpdateNewsArticleRequest): Promise<NewsArticle> => {
    return await apiClient.put<NewsArticle>(`/News/${id}`, news);
  },

  // Delete news article
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/News/${id}`);
  },
};
