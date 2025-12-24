import api from './axios';

export interface Usuario {
  id: string;
  fullname: string;
  role: 'BARBER' | 'CLIENT';
}

export const getBarberos = async () => {
  const { data } = await api.get<Usuario[]>('/usuarios?role=BARBER'); 
  return data;
};

export const getClientes = async () => {
  const { data } = await api.get<Usuario[]>('/usuarios?role=CLIENT');
  return data;
};