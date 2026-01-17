import api from './api';
import type {
  AuthResponse,
  ApiResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from '@/types/auth.types';

export const authService = {
  /**
   * Register a new user
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/logout');
      return response.data;
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  /**
   * Refresh access token
   */
  async refresh(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Get current user info
   */
  async me(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/resend-verification', { email });
    return response.data;
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/reset-password', { token, password });
    return response.data;
  },
};

export default authService;
