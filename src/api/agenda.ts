import api from './axios';

export interface BloqueoResponse {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  esGeneral: boolean;
  barbero?: {
    id: string;
    usuario: {
      nombre: string;
      apellido: string;
    }
  };
}

export interface CreateBloqueoPayload {
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  esGeneral?: boolean;
  barberoId?: string;
}

export const agendaApi = {
  getBloqueos: async (fecha?: string): Promise<BloqueoResponse[]> => {

    const url = fecha ? `/agenda/bloqueos?fecha=${fecha}` : '/agenda/bloqueos';
    const { data } = await api.get(url);
    return data;
  },

  bloquearFecha: async (payload: CreateBloqueoPayload): Promise<BloqueoResponse> => {
    const { data } = await api.post('/agenda/bloqueos', payload);
    return data;
  },

  desbloquearFecha: async (id: string): Promise<void> => {
    await api.delete(`/agenda/bloqueos/${id}`);
  }
};