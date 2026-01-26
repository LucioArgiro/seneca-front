import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReservaData } from './useReservaQueries';
import { useReservaActions } from './useReservaMutations';
import { useDisponibilidad } from './useDisponibilidad';

export const useReservaForm = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { servicios, barberos, isLoading } = useReservaData();
    const { mutate, isPending: isSubmitting, error: mutationError } = useReservaActions();
    const [selectedService, setSelectedService] = useState(state?.turno?.servicio?.id || '');
    const [selectedBarber, setSelectedBarber] = useState(state?.turno?.barbero?.id || state?.barberId || '');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [opcionPago, setOpcionPago] = useState<'TOTAL' | 'SENIA' | 'LOCAL'>('TOTAL');
    useEffect(() => {
        if (!selectedBarber && state?.barberId && barberos.length > 0) {
            setSelectedBarber(state.barberId);
        }
    }, [barberos, state, selectedBarber]);

    const serviceInfo = useMemo(() => servicios.find(s => s.id === selectedService), [selectedService, servicios]);
    const barberInfo = useMemo(() => barberos.find(b => b.id === selectedBarber), [selectedBarber, barberos]);

    const horariosConfig = useMemo(() => barberInfo?.horarios || [], [barberInfo]);
    const { horariosDisponibles, isLoading: loadingHorarios } = useDisponibilidad(selectedDate, selectedBarber, horariosConfig);

    const fechaResumen = useMemo(() => {
        if (!selectedDate) return 'Fecha no seleccionada';
        const [year, month, day] = selectedDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        return dateObj.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' });
    }, [selectedDate]);

    // 👇 EFECTO DE AUTO-SELECCIÓN DE PAGO
    // Si cambia el barbero, verificamos si cobra seña.
    useEffect(() => {
        if (barberInfo) {
            const senia = Number(barberInfo.precioSenia) || 0;
            if (senia === 0) {
                // Si no cobra seña, forzamos pago LOCAL
                setOpcionPago('LOCAL');
            } else {
                // Si cobra seña y estaba en LOCAL, volvemos a TOTAL por defecto
                setOpcionPago(prev => prev === 'LOCAL' ? 'TOTAL' : prev);
            }
        }
    }, [barberInfo]);

    const precios = useMemo(() => {
        const total = Number(serviceInfo?.precio) || 0;
        const senia = Number(barberInfo?.precioSenia) || 0;
        const requierePago = senia > 0;

        return {
            totalServicio: total,
            valorSenia: senia,
            requierePago,
            aPagarHoy: opcionPago === 'TOTAL' ? total : (opcionPago === 'SENIA' ? senia : 0),
            saldoPendiente: opcionPago === 'TOTAL' ? 0 : (opcionPago === 'SENIA' ? Math.max(0, total - senia) : total)
        };
    }, [serviceInfo, barberInfo, opcionPago]);

    // 7. Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTime) return;

        mutate({
            data: {
                fecha: `${selectedDate}T${selectedTime}:00`,
                barberoId: selectedBarber,
                servicioId: selectedService,
            },
            opcionPago,
            isReprogramming: state?.modo === 'reprogramar',
            turnoOriginalId: state?.turno?.id
        });
    };

    // 8. Error Parsing
    const errorMsg = useMemo(() => {
        if (!mutationError) return '';
        const err: any = mutationError;
        return err.response?.data?.message || 'Error al procesar reserva.';
    }, [mutationError]);

    return {
        // Estado UI
        formState: { selectedService, selectedBarber, selectedDate, selectedTime, opcionPago },
        setters: { setSelectedService, setSelectedBarber, setSelectedDate, setSelectedTime, setOpcionPago },
        data: {
            servicios,
            barberos,
            serviceInfo,
            barberInfo,
            horariosDisponibles,
            precios,
            errorMsg,
            fechaResumen
        },
        status: { isLoading, loadingHorarios, isSubmitting, isReprogramming: state?.modo === 'reprogramar' },
        actions: { handleSubmit, navigate }
    };
};