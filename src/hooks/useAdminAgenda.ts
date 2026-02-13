import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAgendaState } from './useAgendaState';
import { useAgendaData } from './useAgendaData';
import { useTurnoVigilante } from './useTurnoVigilante';
import { turnosApi, type TurnoResponse } from '../api/turnos';
import { type BarberoPerfil } from '../types';

// 👇 ACEPTAMOS barberoId OPCIONAL PARA FILTRAR SI ES NECESARIO
export const useAdminAgenda = (barberoId?: string) => {
    const queryClient = useQueryClient();

    // 1. Estado Base de la Agenda (Fechas, Modales, Popovers)
    const agendaState = useAgendaState();
    const { selectedDate, modalConfig, popover, closeModal, closePopover, setModalConfig, openPopover } = agendaState;

    // 2. Datos de la Agenda (Barberos, Turnos, Bloqueos)
    // 👇 PASAMOS EL ID AL HOOK DE DATOS
    const agendaData = useAgendaData(selectedDate, barberoId);
    const { turnos, createBloqueo } = agendaData;

    // 3. Estado y Lógica de Cobro
    const [turnoParaCobrar, setTurnoParaCobrar] = useState<TurnoResponse | null>(null);

    // Mutación para cobrar
    const cobrarMutation = useMutation({
        mutationFn: async ({ id, metodo }: { id: string; metodo: string }) => {
            return await turnosApi.completar(id, {
                metodoPago: metodo
            });
        },
        onSuccess: () => {
            toast.success("¡Cobro registrado y turno cerrado!", {
                style: { background: '#1A1A1A', color: '#fff', border: '1px solid #C9A227' },
                iconTheme: { primary: '#C9A227', secondary: '#1A1A1A' }
            });
            setTurnoParaCobrar(null);
            // Invalidamos queries para refrescar la grilla y la caja
            queryClient.invalidateQueries({ queryKey: ['turnos'] });
            queryClient.invalidateQueries({ queryKey: ['caja'] });
        },
        onError: (err) => {
            console.error(err);
            toast.error("Error al procesar el cobro", {
                style: { background: '#1A1A1A', color: '#fff', border: '1px solid #EF4444' }
            });
        }
    });

    const handleCobrarConfirm = (metodo: 'EFECTIVO' | 'TRANSFERENCIA') => {
        if (turnoParaCobrar?.id) {
            cobrarMutation.mutate({ id: turnoParaCobrar.id, metodo });
        }
    };


    useTurnoVigilante(turnos, (turno) => setTurnoParaCobrar(turno));


    const handleConfirmBloqueo = (data: { motivo: string; horaInicio?: string; horaFin?: string }) => {
        let isGeneral = modalConfig.type === 'GENERAL';
        if (barberoId) {
            isGeneral = false;
        }

        const fechaBase = selectedDate.format('YYYY-MM-DD');
        const targetBarberoId = (modalConfig as any).barberoId || barberoId;

        createBloqueo.mutate({
            fechaInicio: isGeneral
                ? selectedDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss')
                : `${fechaBase}T${data.horaInicio}:00`,
            fechaFin: isGeneral
                ? selectedDate.endOf('day').format('YYYY-MM-DDTHH:mm:ss')
                : `${fechaBase}T${data.horaFin}:00`,
            motivo: data.motivo,
            esGeneral: isGeneral,
            barberoId: !isGeneral ? targetBarberoId : undefined
        }, {
            onSuccess: closeModal
        });
    };


    const handleSlotClick = (e: React.MouseEvent, barbero: BarberoPerfil, hour: number) => {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        const endTimeString = `${(hour + 1).toString().padStart(2, '0')}:00`;

        openPopover(e.clientX, e.clientY, {
            barberoId: barbero.id,
            barberoNombre: `${barbero.usuario.nombre} ${barbero.usuario.apellido}`,
            horaInicio: timeString,
            horaFin: endTimeString
        });
    };

    const handlePopoverAction = (action: string) => {
        const { dataContext } = popover as any;
        closePopover();

        if (action === 'BLOQUEAR' || action === 'DESCANSO') {
            setModalConfig({ isOpen: true, type: 'PARTICULAR', ...dataContext });
        } else if (action === 'AGENDAR') {
            console.log('Abrir modal de agendar para:', dataContext);
            // Aquí podrías abrir un modal para crear turno manual si lo implementas a futuro
        }
    };

    return {
        // Estados y Datos
        agendaState,
        agendaData,
        cobroState: {
            turnoParaCobrar,
            setTurnoParaCobrar,
            isProcessing: cobrarMutation.isPending
        },

        // Handlers
        handlers: {
            handleConfirmBloqueo,
            handleSlotClick,
            handlePopoverAction,
            handleCobrarConfirm
        }
    };
};