import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { turnosApi, type TurnoResponse } from '../api/turnos';
import { barberosApi } from '../api/barberos';

export interface ClienteCRM {
  id: string;
  fullname: string;
  email: string;
  totalTurnos: number;
  totalGastado: number;
  ultimaVisita: string;
  estadoCliente: 'NUEVO' | 'FRECUENTE' | 'VIP' | 'INACTIVO';
  historial: TurnoResponse[];
}

export const useClientesCRM = () => {
  // 1. ESTADOS DE FILTRO (Locales del hook)
  const [filtroBarbero, setFiltroBarbero] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  // 2. PETICIONES CON TANSTACK QUERY (En paralelo)
  const queryTurnos = useQuery({
    queryKey: ['turnos', 'admin-historial'],
    queryFn: turnosApi.getHistorial,
  });

  const queryBarberos = useQuery({
    queryKey: ['barberos'],
    queryFn: barberosApi.getAll,
  });

  // 3. LÓGICA DE PROCESAMIENTO (Memorizada para rendimiento)
  const clientesProcesados = useMemo(() => {
    if (!queryTurnos.data) return [];

    const turnos = queryTurnos.data;

    // A. Filtrar Turnos por Barbero y Estado
    const turnosValidos = turnos.filter((t) => {
      const esFinalizado = t.estado === 'COMPLETADO' || t.estado === 'CANCELADO';
      const cumpleBarbero = filtroBarbero === 'todos' || t.barbero?.id === filtroBarbero;
      return esFinalizado && cumpleBarbero;
    });

    // B. Agrupar por Cliente
    const grupos = turnosValidos.reduce((acc, turno) => {
      const clienteId = turno.cliente?.id;
      if (!clienteId) return acc;

      // Adaptar según tu estructura de datos (si usuario está anidado o plano)
      const nombre = turno.cliente?.usuario?.nombre || 'Anónimo';
      const apellido = turno.cliente?.usuario?.apellido || 'Anónimo';
      const email = turno.cliente?.usuario?.email || 'Sin Email';

      if (!acc[clienteId]) {
        acc[clienteId] = {
          id: clienteId,
          fullname: `${nombre} ${apellido}`,
          email: email,
          totalTurnos: 0,
          totalGastado: 0,
          ultimaVisita: turno.fecha,
          historial: [],
          estadoCliente: 'NUEVO', // Valor default
        };
      }

      acc[clienteId].historial.push(turno);

      // Sumar si está completado
      if (turno.estado === 'COMPLETADO') {
        acc[clienteId].totalTurnos += 1;
        acc[clienteId].totalGastado += Number(turno.servicio?.precio || 0);
      }

      // Actualizar fecha más reciente
      if (new Date(turno.fecha) > new Date(acc[clienteId].ultimaVisita)) {
        acc[clienteId].ultimaVisita = turno.fecha;
      }

      return acc;
    }, {} as Record<string, ClienteCRM>);

    // C. Calcular Etiquetas y Convertir a Array
    let lista = Object.values(grupos).map((c) => {
      const diasSinVenir = (new Date().getTime() - new Date(c.ultimaVisita).getTime()) / (1000 * 3600 * 24);
      
      let etiqueta: ClienteCRM['estadoCliente'] = 'NUEVO';
      if (c.totalTurnos >= 10) etiqueta = 'VIP';
      else if (c.totalTurnos >= 3) etiqueta = 'FRECUENTE';
      if (diasSinVenir > 60) etiqueta = 'INACTIVO';

      return { ...c, estadoCliente: etiqueta };
    });

    // D. Filtro de Búsqueda (Texto)
    if (busqueda) {
      const lower = busqueda.toLowerCase();
      lista = lista.filter(c => c.fullname.toLowerCase().includes(lower) || c.email.toLowerCase().includes(lower));
    }

    // E. Ordenar: Los que vinieron hace poco primero
    return lista.sort((a, b) => new Date(b.ultimaVisita).getTime() - new Date(a.ultimaVisita).getTime());

  }, [queryTurnos.data, filtroBarbero, busqueda]); // Se recalcula solo si esto cambia

  return {
    // Datos procesados
    clientes: clientesProcesados,
    barberos: queryBarberos.data || [],
    
    // Estados de carga y error
    isLoading: queryTurnos.isLoading || queryBarberos.isLoading,
    isError: queryTurnos.isError,

    // Controladores de filtros para la UI
    filtros: {
      barbero: filtroBarbero,
      setBarbero: setFiltroBarbero,
      busqueda,
      setBusqueda
    }
  };
};