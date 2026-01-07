import { useQuery } from '@tanstack/react-query';
import { getBarberos } from '../api/usuarios';

export const useBarberos = () => {
  const query = useQuery({
    queryKey: ['barbero'],
    queryFn: getBarberos, 
    staleTime: 1000 * 60 * 10,
  });

  return query;
};