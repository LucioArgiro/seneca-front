import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { turnosApi} from '../api/turnos';
import {type HorarioBarbero } from '../types'; // Asegúrate de tener este type definido

export const useDisponibilidad = (
    fecha: string | null, 
    barberoId: string | null, 
    horariosConfig: HorarioBarbero[] = [] // 👇 Nuevo: Recibe la configuración del barbero
) => {

    // 1. QUERY: Traer horarios ocupados (Igual que antes)
    const { data: ocupados = [], isLoading, isError } = useQuery({
        queryKey: ['disponibilidad', fecha, barberoId],
        queryFn: () => turnosApi.getHorariosOcupados(fecha!, barberoId!),
        enabled: !!fecha && !!barberoId,
        staleTime: 1000 * 60 * 5, 
    });

    const horariosDisponibles = useMemo(() => {
        // Validaciones básicas
        if (!fecha || !barberoId) return [];

        // 2. DETECTAR EL DÍA DE LA SEMANA
        // Truco: Agregamos T12:00:00 para evitar problemas de zona horaria al pedir el día
        // getDay() devuelve: 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        const diaSemana = new Date(`${fecha}T12:00:00`).getDay();

        // 3. FILTRAR LA CONFIGURACIÓN PARA ESE DÍA
        // Esto nos da un array. Ej: [{inicio: '09:00', fin: '13:00'}, {inicio: '17:00', fin: '21:00'}]
        const rangosDelDia = horariosConfig.filter(h => h.diaSemana === diaSemana);

        // Si no hay configuración para hoy, el barbero no trabaja
        if (rangosDelDia.length === 0) return [];

        const slots: string[] = [];
        const ahora = new Date();
        const fechaSeleccionada = new Date(`${fecha}T00:00:00`);
        const esHoy = fechaSeleccionada.toDateString() === ahora.toDateString();

        // 4. GENERAR SLOTS PARA CADA RANGO (Soporta turno cortado)
        rangosDelDia.forEach(rango => {
            // Convertimos "09:30" a números: hora=9, min=30
            const [horaInicio, minInicio] = rango.horaInicio.split(':').map(Number);
            const [horaFin, minFin] = rango.horaFin.split(':').map(Number);

            let hora = horaInicio;
            let minutos = minInicio;

            // Bucle: Mientras no lleguemos a la hora de fin...
            while (hora < horaFin || (hora === horaFin && minutos < minFin)) {
                
                // Formato visual "09:30"
                const horarioStr = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
                
                // Validación 1: ¿Está ocupado en el backend?
                const estaOcupado = ocupados.includes(horarioStr);
                
                // Validación 2: ¿Ya pasó la hora? (Solo si es hoy)
                let yaPaso = false;
                if (esHoy) {
                    const fechaSlot = new Date();
                    fechaSlot.setHours(hora, minutos, 0, 0);
                    if (fechaSlot < ahora) yaPaso = true;
                }

                // Si pasa las pruebas, lo agregamos
                if (!estaOcupado && !yaPaso) {
                    slots.push(horarioStr);
                }

                // Avanzar 30 minutos
                minutos += 30;
                if (minutos >= 60) {
                    hora++;
                    minutos = 0;
                }
            }
        });

        // 5. Ordenar cronológicamente (Importante si los rangos venían desordenados)
        return slots.sort();

    }, [fecha, barberoId, ocupados, horariosConfig]); // 👈 Dependencias actualizadas

    return { horariosDisponibles, isLoading, isError };
};