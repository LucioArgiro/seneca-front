import api from './axios';
import type { ClientePerfil, UpdateClienteDto } from '../types';

export const clientesApi = {
  // Obtener mi perfil de cliente
  getMyProfile: async () => {
    const { data } = await api.get<ClientePerfil>('/clientes/me');
    return data;
  },

  // Actualizar mis datos
  updateProfile: async (datos: UpdateClienteDto) => {
    const { data } = await api.patch<ClientePerfil>('/clientes/me', datos);
    return data;
  },
  
  // (Opcional) Si el Admin necesita ver todos los clientes con detalle
  getAll: async () => {
      const { data } = await api.get<ClientePerfil[]>('/clientes');
      return data;
  }
};