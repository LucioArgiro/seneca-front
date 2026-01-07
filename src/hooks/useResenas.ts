import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Ahora estos imports SÍ funcionarán porque los acabamos de exportar arriba 👆
import { getResenasByBarber, createResena, type CreateResenaPayload } from '../api/resenas';

export const useResenas = (barberoId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['resenas', barberoId];

  // 1. LEER (GET)
  const query = useQuery({
    queryKey: queryKey,
    queryFn: () => getResenasByBarber(barberoId!),
    enabled: !!barberoId, 
    staleTime: 1000 * 60 * 5, 
  });

  // 2. CREAR (POST)
  const mutation = useMutation({
    mutationFn: (newReview: CreateResenaPayload) => createResena(newReview),
    
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError: (error: any) => {
      console.error(error);
      alert(error.response?.data?.message || 'Error al guardar la reseña');
    },
  });

  return {
    ...query,      // Devuelve data, isLoading, isError...
    createResena: mutation.mutate, // Función para ejecutar la creación
    isCreating: mutation.isPending // Estado de carga de la creación
  };
};