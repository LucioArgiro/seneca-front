// src/hooks/useTurnos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { turnosApi, type TurnoResponse } from '../api/turnos';

export const useMisTurnos = () => {
  const queryClient = useQueryClient();

  // 1. QUERY: Obtener turnos
  const query = useQuery({
    queryKey: ['mis-turnos'],
    queryFn: turnosApi.getMyTurnos,
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
  });

  // 2. MUTATION: Cancelar turno
  const cancelarMutation = useMutation({
    mutationFn: turnosApi.cancelarTurno,
    onSuccess: () => {
      // Al cancelar, recargamos la lista automáticamente
      queryClient.invalidateQueries({ queryKey: ['mis-turnos'] });
      alert('Turno cancelado correctamente');
    },
    onError: () => {
      alert('Hubo un error al cancelar el turno');
    }
  });

  // 3. Lógica derivada (Próximos vs Historial)
  const now = new Date();
  const turnos = query.data || [];

  const proximos = turnos
    .filter((t: TurnoResponse) => new Date(t.fecha) >= now && t.estado !== 'CANCELADO')
    .sort((a: TurnoResponse, b: TurnoResponse) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const historial = turnos
    .filter((t: TurnoResponse) => new Date(t.fecha) < now || t.estado === 'CANCELADO')
    .sort((a: TurnoResponse, b: TurnoResponse) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return {
    turnos,
    proximos,
    historial,
    isLoading: query.isLoading,
    isError: query.isError,
    cancelarTurno: cancelarMutation.mutate,
    isCanceling: cancelarMutation.isPending,
    refetch: query.refetch
  };
};