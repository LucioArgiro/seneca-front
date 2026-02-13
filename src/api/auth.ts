import api from './axios';

// Definimos la interfaz para que TypeScript nos ayude
interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  pais?: string;
  provincia?: string;
}

export const loginRequest = async (email: string, pass: string) => {
  const { data } = await api.post('/auth/login', { email, password: pass });
  return data;
};


export const registerRequest = async (user: RegisterData) => {
  const { data } = await api.post('/auth/register', user);
  return data;
};