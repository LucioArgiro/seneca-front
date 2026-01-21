import { useQuery } from '@tanstack/react-query';
import { barberosApi } from '../api/barberos';

// 👇 Este hook DEBE recibir un ID
export const useBarber = (id?: string) => {
  const query = useQuery({
    queryKey: ['barber', id], // La clave incluye el ID para que sea único
    queryFn: () => barberosApi.getProfile(id!), // 👈 Llama a getProfile, NO a getAll
    enabled: !!id, // Solo se ejecuta si hay ID
    retry: 1,      // No reintentar infinitamente si falla
  });

  return query;
};