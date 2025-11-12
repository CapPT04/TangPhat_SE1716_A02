import { apiClient } from './api.service';
import { NewsArticle } from '@/types/news.types';
import { Category } from '@/types/category.types';

export const reportService = {
  // Get all counts from single endpoint
  getCounts: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const queryString = params.toString();
    return apiClient.get<{
      totalArticles: number;
      publishedArticles: number;
      draftArticles: number;
      totalAuthors: number;
      totalUsers: number;
      totalCategories: number;
      totalTags: number;
    }>(`/reports/counts${queryString ? `?${queryString}` : ''}`);
  },

  // Get all news for detailed analysis
  getAllNews: () => apiClient.get<NewsArticle[]>('/reports/all-news'),
  
  // Get all categories
  getAllCategories: () => apiClient.get<Category[]>('/reports/all-categories'),
  
  // Get all tags
  getAllTags: () => apiClient.get<any[]>('/reports/all-tags'),
};
