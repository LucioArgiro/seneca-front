import { useQuery } from '@tanstack/react-query';
import { getServicios } from '../api/servicios';
import { barberosApi } from '../api/barberos';

export const useReservaData = () => {
  // 1. Traer Servicios (Cacheado por 1 hora)
  const serviciosQuery = useQuery({
    queryKey: ['servicios'],
    queryFn: async () => {
      const data = await getServicios();
      return data.filter(s => s.activo); // Filtramos solo activos
    },
    staleTime: 1000 * 60 * 60, 
  });

  // 2. Traer Barberos
  const barberosQuery = useQuery({
    queryKey: ['barberos'],
    queryFn: barberosApi.getAll,
    staleTime: 1000 * 60 * 30,
  });

  return {
    servicios: serviciosQuery.data || [],
    barberos: barberosQuery.data || [],
    isLoading: serviciosQuery.isLoading || barberosQuery.isLoading,
    isError: serviciosQuery.isError || barberosQuery.isError
  };
};