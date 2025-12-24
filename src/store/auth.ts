import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  fullname: string;
  role: string;
}
interface AuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  setLogin: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuth: false,

      setLogin: (token, user) => set({ token, user, isAuth: true }),
      
      logout: () => set({ token: null, user: null, isAuth: false }),
    }),
    {
      name: 'auth-storage', 
    }
  )
);