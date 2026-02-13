import api from './axios';
import type { Usuario } from '../types';

export const usuariosApi = {
    // Solo para Admin (lista general de usuarios sin perfil detallado)
    getAll: async () => {
        const { data } = await api.get<Usuario[]>('/usuarios'); 
        return data;
    },

    // Buscar un usuario base por ID
    getById: async (id: string) => {
        const { data } = await api.get<Usuario>(`/usuarios/${id}`);
        return data;
    },

    // Actualizar datos base (rol, activo, etc.)
    update: async (id: string, datos: Partial<Usuario>) => {
        const { data } = await api.patch<Usuario>(`/usuarios/${id}`, datos);
        return data;
    }
};