import apiClient from './api';
import { UserInfo } from './authApi';

export const userApi = {
  getUserInfo: async (): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>('/user/info');
    return response.data;
  },

  getProfile: async (): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>('/user/profile');
    return response.data;
  },
};
