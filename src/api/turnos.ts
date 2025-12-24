import api from './axios';

// Definimos la interfaz de lo que vamos a mandar
export interface CreateTurnoDto {
  fecha: string; 
  clienteId: string;
  barberoId: string;
  servicioId: string;
}

export const createTurno = async (data: CreateTurnoDto) => {
  const response = await api.post('/turnos', data);
  return response.data;
};

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
    fullname: string;
    email?: string; 
  };
  barbero?: {
    id: string;
    fullname: string;
  };
}

export const getTurnos = async () => {
  const { data } = await api.get<TurnoResponse[]>('/turnos');
  return data;
};

export const updateEstadoTurno = async (id: string, estado: 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO') => {
  const { data } = await api.patch<TurnoResponse>(`/turnos/${id}/estado`, { estado });
  return data;
};

export const cancelarTurnoCliente = async (id: string) => {
  const { data } = await api.patch(`/turnos/${id}/cancelar`);
  return data;
};