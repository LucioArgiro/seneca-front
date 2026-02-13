import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cajaApi, type CajaResponse } from '../api/caja';
import { toast } from 'react-hot-toast';

export const useCaja = (role: 'ADMIN' | 'BARBER', initialFilter: string = '') => {
    const queryClient = useQueryClient();

    // Estado del filtro (Solo para Admin)
    const [selectedCajaId, setSelectedCajaId] = useState<string>(initialFilter);

    // 1. QUERY PRINCIPAL
    const cajaQuery = useQuery<CajaResponse>({
        queryKey: ['caja', role, selectedCajaId],
        queryFn: async () => {
            // A. Si soy Barbero -> Siempre veo mi caja (endpoint /me)
            if (role === 'BARBER') {
                return cajaApi.getMiCaja();
            }

            // B. Si soy Admin
            // Si el filtro está vacío o es 'CENTRAL', quiero ver la CAJA GLOBAL.
            // Al llamar a getMiCaja() siendo Admin, el backend ya sabe devolver la Central.
            if (!selectedCajaId || selectedCajaId === 'CENTRAL') {
                return cajaApi.getMiCaja();
            }

            // Si seleccioné un Barbero específico, pido su vista filtrada
            return cajaApi.getCajaByUserId(selectedCajaId);
        },
        staleTime: 1000 * 60 * 2, // 2 minutos de cache
        refetchOnWindowFocus: true
    });

    // 2. QUERY PARA EL SELECTOR (Solo Admin)
    const allCajasQuery = useQuery({
        queryKey: ['all-cajas'],
        queryFn: cajaApi.getAllCajas,
        enabled: role === 'ADMIN',
    });

    // 3. MUTATION
    const crearMovimiento = useMutation({
        mutationFn: cajaApi.crearMovimiento,
        onSuccess: () => {
            toast.success('Movimiento registrado', {
                style: { background: '#1A1A1A', color: '#fff', border: '1px solid #C9A227' }
            });
            queryClient.invalidateQueries({ queryKey: ['caja'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Error al registrar');
        }
    });

    return {
        caja: cajaQuery.data?.info,
        movimientos: cajaQuery.data?.movimientos || [],
        isLoading: cajaQuery.isLoading,
        isError: cajaQuery.isError,

        // Datos Selector
        listaCajas: allCajasQuery.data || [],
        selectedCajaId,
        setSelectedCajaId,

        registrarMovimiento: crearMovimiento.mutate,
        isRegistering: crearMovimiento.isPending,
        refetch: cajaQuery.refetch
    };
};