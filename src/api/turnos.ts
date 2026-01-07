import api from './axios';

export interface CreateTurnoDto {
  fecha: string;
  barberoId: string;
  servicioId: string;
}

export interface TurnoResponse {
  id: string;
  fecha: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'COMPLETADO' | 'CANCELADO';
  servicio?: {
    id: string;
    nombre: string;
    precio: number;
    duracionMinutos?: number;
  };
  cliente?: {
    id: string;
    usuario?: { 
        fullname: string;
        email?: string;
    }
  };
  barbero?: {
    id: string;
    usuario?: {
        fullname: string;
    }
  };
}
export const createTurno = async (data: CreateTurnoDto) => {
  const response = await api.post('/turnos', data);
  return response.data;
};
export const getMyTurnos = async () => {
  const { data } = await api.get<TurnoResponse[]>('/turnos/mis-turnos');
  return data;
};

export const cancelarTurnoCliente = async (id: string) => {
  const { data } = await api.patch(`/turnos/${id}/cancelar`);
  return data;
};

export const turnosApi = {
  getAgenda: async () => {
    const { data } = await api.get<TurnoResponse[]>('/turnos/agenda');
    return data;
  },

  getHistorial: async () => {
    const { data } = await api.get<TurnoResponse[]>('/turnos/historial-clientes');
    return data;
  },
  updateEstado: async (id: string, estado: 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO') => {
      const { data } = await api.patch<TurnoResponse>(`/turnos/${id}/estado`, { estado });
      return data;
  }
};

export const updateEstadoTurno = async (id: string, estado: 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO') => {
  const { data } = await api.patch<TurnoResponse>(`/turnos/${id}/estado`, { estado });
  return data;
};

export const getTurnos = async () => {
  const { data } = await api.get<TurnoResponse[]>('/turnos');
  return data;
};