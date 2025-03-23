import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

interface SignupResponse {
  id: number;
  email: string;
}
export const signup = async (email: string, password: string):Promise<SignupResponse> => {
  const response = await api.post('/auth/signup', { email, password });
  return response.data;
};

interface LoginResponse {
  token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
};

