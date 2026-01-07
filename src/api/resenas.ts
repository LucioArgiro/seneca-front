import api from './axios';
import type { Resena } from '../types'; // Asegúrate de tener el archivo types/index.ts que creamos antes

// 1. Definimos el "Payload" (los datos que enviamos al crear)
export interface CreateResenaPayload {
  barberoId: string; // IMPORTANTE: Este es el ID del USUARIO barbero
  calificacion: number;
  comentario: string;
}

// 2. Función para OBTENER reseñas (GET)
export const getResenasByBarber = async (barberoUsuarioId: string): Promise<Resena[]> => {
  // El endpoint espera el ID del usuario, no del perfil barbero
  const { data } = await api.get<Resena[]>(`/resenas/barbero/${barberoUsuarioId}`);
  return data;
};

// 3. Función para CREAR reseña (POST)
export const createResena = async (payload: CreateResenaPayload): Promise<Resena> => {
  const { data } = await api.post<Resena>('/resenas', payload);
  return data;
};