import { apiClient } from './api.service';
import { NewsArticle } from '@/types/news.types';
import { Category } from '@/types/category.types';

export const reportService = {
  getCounts: async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const queryString = params.toString();
      
      const [countsResponse, categories, tags, accounts] = await Promise.all([
        apiClient.get<{
          totalArticles: number;
          activeArticles: number;
          inactiveArticles: number;
          totalAuthors: number;
        }>(`/News/counts${queryString ? `?${queryString}` : ''}`),
        apiClient.get<Category[]>('/Categories'),
        apiClient.get<any[]>('/Tags'),
        apiClient.get<any[]>('/Accounts')
      ]);
      
      return {
        totalArticles: countsResponse.totalArticles,
        activeArticles: countsResponse.activeArticles,
        inactiveArticles: countsResponse.inactiveArticles,
        totalAuthors: countsResponse.totalAuthors,
        totalUsers: accounts.length,
        totalCategories: categories.length,
        totalTags: tags.length,
      };
    } catch (error) {
      console.error('Error in getCounts:', error);
      throw error;
    }
  },

  getAllNews: () => apiClient.get<NewsArticle[]>('/News'),
  
  getAllCategories: () => apiClient.get<Category[]>('/Categories'),
  
  getAllTags: () => apiClient.get<any[]>('/Tags'),
};
