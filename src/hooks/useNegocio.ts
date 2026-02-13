import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios'; // Asegúrate que la ruta sea correcta
import { toast } from 'react-hot-toast';

export const useNegocio = () => {
    const queryClient = useQueryClient();

    // 1. OBTENER DATOS DEL NEGOCIO
    const { data: negocio, isLoading } = useQuery({
        queryKey: ['negocio'],
        queryFn: async () => {
            const { data } = await api.get('/negocio');
            return data;
        },
        staleTime: 1000 * 60 * 60, // 1 Hora de caché (no cambia seguido)
        refetchOnWindowFocus: false
    });

    // 2. ACTUALIZAR DATOS
    const updateNegocio = useMutation({
        mutationFn: async (datos: any) => {
            return await api.put('/negocio', datos);
        },
        onSuccess: () => {
            toast.success('¡Configuración guardada correctamente!');
            queryClient.invalidateQueries({ queryKey: ['negocio'] }); // Refresca los datos en toda la app
        },
        onError: (error: any) => {
            console.error(error);
            toast.error('Error al guardar la configuración');
        }
    });

    return { 
        negocio, 
        isLoading, 
        updateNegocio 
    };
};