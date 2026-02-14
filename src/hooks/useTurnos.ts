// src/hooks/useTurnos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { turnosApi, type TurnoResponse } from '../api/turnos';
import { useMemo } from 'react';

export const useMisTurnos = () => {
  const queryClient = useQueryClient();

  // 1. QUERY: Obtener todos los turnos
  const query = useQuery({
    queryKey: ['mis-turnos'],
    queryFn: turnosApi.getMyTurnos,
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
    retry: 1,
  });

  // 2. MUTATION: Cancelar turno
  const cancelarMutation = useMutation({
    mutationFn: turnosApi.cancelarTurno,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-turnos'] });
    },
    onError: (error) => {
      console.error("Error al cancelar turno:", error);
    }
  });

  // 3. LÓGICA DE FILTRADO (Centralizada aquí)
  const { proximos, historial } = useMemo(() => {
    const todos = query.data || [];
    const now = new Date();

    // A. PRÓXIMOS (Futuros y Activos)
    const prox = todos
      .filter((t: TurnoResponse) => {
        const fechaTurno = new Date(t.fecha);
        const estado = t.estado ? t.estado.toUpperCase() : '';
        // Solo PENDIENTE o CONFIRMADO y que sean FUTUROS
        return fechaTurno >= now && (estado === 'PENDIENTE' || estado === 'CONFIRMADO');
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); // Orden Ascendente

    // B. HISTORIAL (Pasados, Cancelados o Completados)
    const hist = todos
      .filter((t: TurnoResponse) => {
        const fechaTurno = new Date(t.fecha);
        const estado = t.estado ? t.estado.toUpperCase() : '';
        
        const esPasado = fechaTurno < now;
        const esCancelado = estado === 'CANCELADO';
        const esCompletado = estado === 'COMPLETADO';

        return esPasado || esCancelado || esCompletado;
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); // Orden Descendente

    return { proximos: prox, historial: hist };
  }, [query.data]);

  return {
    turnos: query.data || [],
    proximos,   // Ya viene filtrado
    historial,  // Ya viene filtrado
    isLoading: query.isLoading,
    isError: query.isError,
    cancelarTurno: cancelarMutation.mutate,
    isCanceling: cancelarMutation.isPending,
    refetch: query.refetch
  };
};