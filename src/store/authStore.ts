import { create } from 'zustand';
import { type User, type AuthState } from '@/types';
import { loginAPI } from '@/lib/api';

const storedUserRaw = localStorage.getItem('fb_user');
const storedToken = localStorage.getItem('fb_token');
let storedUser: User | null = null;

try {
  storedUser = storedUserRaw ? (JSON.parse(storedUserRaw) as User) : null;
} catch {
  localStorage.removeItem('fb_user');
}

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  token: storedToken || null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await loginAPI({ email, password });
      const { user, token } = res.data;
      localStorage.setItem('fb_token', token);
      localStorage.setItem('fb_user', JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('fb_token');
    localStorage.removeItem('fb_user');
    set({ user: null, token: null });
  },

  setUser: (user: User, token: string) => {
    localStorage.setItem('fb_token', token);
    localStorage.setItem('fb_user', JSON.stringify(user));
    set({ user, token });
  },
}));