import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barberosApi } from '../api/barberos';
import { turnosApi } from '../api/turnos';
import { agendaApi, type CreateBloqueoPayload } from '../api/agenda';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';

// 👇 AGREGAMOS barberoId OPCIONAL AQUÍ
export const useAgendaData = (selectedDate: dayjs.Dayjs, barberoId?: string) => {
    const queryClient = useQueryClient();
    const fechaFormatAPI = selectedDate.format('YYYY-MM-DD');
    const startOfDay = selectedDate.startOf('day').toISOString();
    const endOfDay = selectedDate.endOf('day').toISOString();

    // 1. BARBEROS
    const { data: barberos = [], isLoading: isLoadingBarberos } = useQuery({ 
        queryKey: ['barberos'], 
        queryFn: barberosApi.getAll,
        staleTime: 1000 * 60 * 60, 
    });
    
    // 2. TURNOS (Ahora enviamos barberoId si existe)
    const { data: turnos = [], isLoading: isLoadingTurnos } = useQuery({ 
        // 👇 Agregamos barberoId a la key para que cachee por separado
        queryKey: ['turnos', fechaFormatAPI, barberoId], 
        queryFn: async () => {
            return await turnosApi.getTurnos({ 
                desde: startOfDay, 
                hasta: endOfDay,
                barberoId: barberoId // 👈 SE ENVÍA AL BACKEND
            });
        }
    });
    
    // 3. BLOQUEOS
    const { data: bloqueos = [], isLoading: isLoadingBloqueos } = useQuery({ 
        queryKey: ['bloqueos', fechaFormatAPI, barberoId], 
        queryFn: () => agendaApi.getBloqueos(fechaFormatAPI) 
        // Nota: Idealmente tu API de bloqueos también debería filtrar por barberoId si es necesario
    });

    // ... (Mutations createBloqueo y deleteBloqueo quedan igual) ...
    const createBloqueo = useMutation({
        mutationFn: (payload: CreateBloqueoPayload) => agendaApi.bloquearFecha(payload),
        onSuccess: () => {
            toast.success('Bloqueo creado');
            queryClient.invalidateQueries({ queryKey: ['bloqueos'] });
        },
        onError: (e: any) => toast.error(e.response?.data?.message || 'Error al bloquear')
    });

    const deleteBloqueo = useMutation({
        mutationFn: agendaApi.desbloquearFecha,
        onSuccess: () => {
            toast.success('Bloqueo eliminado');
            queryClient.invalidateQueries({ queryKey: ['bloqueos'] });
        }
    });

    return {
        barberos,
        turnos,
        bloqueos,
        isLoading: isLoadingBarberos || isLoadingTurnos || isLoadingBloqueos,
        createBloqueo,
        deleteBloqueo
    };
};