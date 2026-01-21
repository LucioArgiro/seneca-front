import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barberosApi } from '../api/barberos';
import { turnosApi } from '../api/turnos';
import { agendaApi, type CreateBloqueoPayload } from '../api/agenda';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';

export const useAgendaData = (selectedDate: dayjs.Dayjs) => {
    const queryClient = useQueryClient();
    const fechaFormatAPI = selectedDate.format('YYYY-MM-DD');

    // QUERIES
    const { data: barberos = [], isLoading } = useQuery({ 
        queryKey: ['barberos'], 
        queryFn: barberosApi.getAll 
    });
    
    const { data: turnos = [] } = useQuery({ 
        queryKey: ['turnos', fechaFormatAPI], 
        queryFn: () => turnosApi.getTurnos(fechaFormatAPI) 
    });
    
    const { data: bloqueos = [] } = useQuery({ 
        queryKey: ['bloqueos', fechaFormatAPI], 
        queryFn: () => agendaApi.getBloqueos(fechaFormatAPI) 
    });

    // MUTATIONS
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
        isLoading,
        createBloqueo, // Retornamos la mutación completa
        deleteBloqueo
    };
};