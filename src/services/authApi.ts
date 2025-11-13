import apiClient from './api';

export interface LoginRequest {
  firebaseIdToken: string;
}

export interface UserInfo {
  id: number;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoUrl: string;
  provider: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export const authApi = {
  login: async (firebaseIdToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      firebaseIdToken,
    });
    return response.data;
  },

  healthCheck: async () => {
    const response = await apiClient.get('/auth/health');
    return response.data;
  },
};
