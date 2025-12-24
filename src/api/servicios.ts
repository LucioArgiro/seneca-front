import api from './axios';

export interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracionMinutos: number;
  descripcion?: string; 
  activo?: boolean;
  popular?: boolean;
  features?: string;
}

export const getServicios = async () => {
  const { data } = await api.get<Servicio[]>('/servicios'); 
  return data;
};

export const createServicio = async (servicio: Omit<Servicio, 'id'>) => {
  const { data } = await api.post<Servicio>('/servicios', servicio);
  return data;
};

export const updateServicio = async (id: string, servicio: Partial<Servicio>) => {
  const { data } = await api.patch<Servicio>(`/servicios/${id}`, servicio);
  return data;
};

export const deleteServicio = async (id: string) => {
  const { data } = await api.delete<void>(`/servicios/${id}`);
  return data;
};