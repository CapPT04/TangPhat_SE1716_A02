import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5163/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Don't auto-redirect on 401 - let components handle it
        // This prevents page reload loops
        console.error('API Error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    // Backend returns {message, statusCode, data}, extract data field
    return response.data?.data !== undefined ? response.data.data : response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    // Backend returns {message, statusCode, data}, extract data field
    return response.data?.data !== undefined ? response.data.data : response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    // Backend returns {message, statusCode, data}, extract data field
    return response.data?.data !== undefined ? response.data.data : response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    // Backend returns {message, statusCode, data}, extract data field
    return response.data?.data !== undefined ? response.data.data : response.data;
  }
}

export const apiClient = new ApiClient();
