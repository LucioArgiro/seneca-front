import { useQuery } from '@tanstack/react-query';
import { barberosApi } from '../api/barberos';
import type { BarberoPerfil } from '../types'; 

export const useBarberos = () => {
  const query = useQuery<BarberoPerfil[]>({
    queryKey: ['barberos'],
    queryFn: barberosApi.getAll,
    staleTime: 1000 * 60 * 10, 
  });

  return query;
};