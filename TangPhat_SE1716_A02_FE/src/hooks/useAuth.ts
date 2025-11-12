import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { LoginRequest } from '@/types/auth.types';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      
      // apiClient now extracts the 'data' field from {message, statusCode, data}
      // so response is directly {accountId, accountName, accountEmail, accountRole, token}
      const { token, accountId, accountName, accountEmail, accountRole } = response;
      const user = { accountId, accountName, accountEmail, accountRole };
      
      authService.storeAuth(token, user);
      
      // Redirect based on role
      if (accountRole === 3) {
        // Admin role = 3 (from appsettings)
        navigate('/admin/accounts', { replace: true });
      } else if (accountRole === 1) {
        // Staff role = 1
        navigate('/staff/categories', { replace: true });
      } else if (accountRole === 2) {
        // Lecturer role = 2
        navigate('/lecturer/my-news', { replace: true });
      } else {
        // Default fallback
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    navigate('/login');
  };

  return { logout };
};
