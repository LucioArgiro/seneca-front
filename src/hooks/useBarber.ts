import { useQuery } from '@tanstack/react-query';
import { getUsuarioById } from '../api/usuarios';

// Este hook SÍ acepta un ID como argumento
export const useBarber = (id?: string) => {
  const query = useQuery({
    queryKey: ['barber', id], 
    queryFn: () => getUsuarioById(id!), // Llama a la función que busca UNO solo
    enabled: !!id, 
  });

  return query;
};