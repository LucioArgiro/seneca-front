import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  role: string;
}
interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuth: boolean;
  setLogin: (token: string, user: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuth: false,

      setLogin: (token, usuario) => set({ token, usuario, isAuth: true }),
      
      logout: () => set({ token: null, usuario: null, isAuth: false }),
    }),
    {
      name: 'auth-storage', 
    }
  )
);