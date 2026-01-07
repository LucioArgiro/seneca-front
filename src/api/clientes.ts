import api from './axios';
import type { ClientePerfil, UpdateClienteDto } from '../types';

export const clientesApi = {
  getMyProfile: async () => {
    const { data } = await api.get<ClientePerfil>('/clientes/me');
    return data;
  },

  updateProfile: async (datos: UpdateClienteDto) => {
    const { data } = await api.patch<ClientePerfil>('/clientes/me', datos);
    return data;
  },
};