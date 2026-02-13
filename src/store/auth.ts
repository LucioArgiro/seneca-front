import { create } from 'zustand';
import api from '../api/axios';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  role: string;
}

interface AuthState {
  usuario: Usuario | null;
  isAuth: boolean;
  isChecking: boolean;
  setLogin: (user: Usuario) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  isAuth: false,
  isChecking: true, // Empieza cargando

  setLogin: (usuario) => set({
    usuario,
    isAuth: true,
    isChecking: false // 👈 CORRECCIÓN 1: Importante para evitar loops de carga
  }),

  checkAuth: async () => {
    try {
      // 1. Truco Anti-Caché: Agregamos un timestamp (?t=...) para que la URL sea siempre única
      const { data } = await api.get(`/auth/verify?t=${new Date().getTime()}`);

      console.log("Datos recibidos en verify:", data); // 👈 DEBUG PARA VER SI LLEGA EL NOMBRE

      // 2. Validación de Seguridad: Si no hay usuario dentro de data, lanzamos error manual
      if (!data || !data.user) {
        throw new Error("Respuesta vacía o sin usuario");
      }

      set({
        usuario: data.user,
        isAuth: true,
        isChecking: false
      });
    } catch (error) {
      console.error("Error o sesión inválida:", error);
      set({
        usuario: null,
        isAuth: false,
        isChecking: false
      });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ usuario: null, isAuth: false, isChecking: false });
    }
  },
}));