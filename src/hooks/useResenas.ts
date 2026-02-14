import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResenasByBarber, createResena, type CreateResenaPayload } from '../api/resenas';
import { toast } from 'react-hot-toast'; // 👈 1. Importamos Toast

export const useResenas = (barberoId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['resenas', barberoId];

  // 1. LEER (GET)
  const query = useQuery({
    queryKey: queryKey,
    queryFn: () => getResenasByBarber(barberoId!),
    enabled: !!barberoId,
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

  // 2. CREAR (POST)
  const mutation = useMutation({
    mutationFn: (newReview: CreateResenaPayload) => createResena(newReview),

    onSuccess: () => {
      // ✅ A: Recargamos la lista de reseñas para que aparezca la nueva
      queryClient.invalidateQueries({ queryKey: queryKey });

      // ✅ B: IMPORTANTE - Recargamos al barbero para actualizar su promedio de estrellas en el header
      queryClient.invalidateQueries({ queryKey: ['barbero', barberoId] });

      // ✅ C: Feedback visual sutil (opcional, ya que el componente también lo hace)
      // toast.success('Opinión guardada correctamente'); 
    },

    onError: (error: any) => {
      console.error(error);
      // ❌ ADIÓS ALERT -> HOLA TOAST
      const mensaje = error.response?.data?.message || 'Error al guardar la reseña';
      toast.error(mensaje);
    },
  });

  return {
    ...query,
    // Exponemos data, isLoading, isError del GET
    resenas: query.data, // Alias opcional para mayor claridad

    // Acciones del POST
    createResena: mutation.mutate,
    isCreating: mutation.isPending
  };
};