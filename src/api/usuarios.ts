import api from './axios';

export interface Usuario {
  id: string;
  fullname: string;
  email: string;
  role: 'BARBER' | 'CLIENT';
  phone?: string;
  pais?: string;
  provincia?: string;
  biografia?: string;
  fotoUrl?: string;
  activo?: boolean;
}

export const getUsuarios = async (): Promise<Usuario[]> => {
  const { data } = await api.get('/usuarios'); 
  return data;
};

export const getUsuarioById = async (id: string): Promise<Usuario> => {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
};

export const getBarberos = async (): Promise<Usuario[]> => { 
  const { data } = await api.get('/usuarios');
  return data.filter((u: any) => u.role === 'BARBER' || u.role === 'BARBERO');
};

export const getClientes = async () => {
  const { data } = await api.get<Usuario[]>('/usuarios?role=CLIENT');
  return data;
};

export const updateUsuario = async (id: string, datos: Partial<Usuario>) => {
  const { data } = await api.patch(`/usuarios/${id}`, datos);
  return data;
};