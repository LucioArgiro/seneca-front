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

    // Lógica de Precios
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

    // EFECTO DE AUTO-SELECCIÓN DE PAGO (Optimizado)
    useEffect(() => {
        if (barberInfo) {
            const senia = Number(barberInfo.precioSenia) || 0;
            if (senia === 0) {
                // Si la seña es 0, por defecto sugerimos LOCAL, pero permitimos al usuario cambiar a TOTAL si quiere
                // Solo forzamos si la opción actual era SENIA (que no tiene sentido con seña 0)
                setOpcionPago(prev => prev === 'SENIA' ? 'LOCAL' : prev === 'TOTAL' ? prev : 'LOCAL');
            } else {
                // Si hay seña obligatoria, nunca puede ser LOCAL
                setOpcionPago(prev => prev === 'LOCAL' ? 'TOTAL' : prev);
            }
        }
    }, [barberInfo]);

    // 7. Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTime) return;

        // 👇 AQUÍ ESTABA LA CLAVE: Enviamos montoPagar al Backend
        const montoAEnviar = precios.aPagarHoy;

        mutate({
            data: {
                fecha: `${selectedDate}T${selectedTime}:00`,
                barberoId: selectedBarber,
                servicioId: selectedService,
                montoPagar: montoAEnviar,
                tipoPago: opcionPago 
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