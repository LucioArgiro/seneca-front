import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { turnosApi, type TurnoResponse } from '../api/turnos';
import { barberosApi } from '../api/barberos';
import dayjs from 'dayjs';

export interface ClienteCRM {
  id: string;
  fullname: string;
  email: string;
  telefono: string;
  totalTurnos: number;
  totalGastado: number;
  ultimaVisita: string;
  estadoCliente: 'NUEVO' | 'FRECUENTE' | 'VIP' | 'INACTIVO';
  historial: TurnoResponse[];
}

export const useClientesCRM = () => {
  const [filtroBarbero, setFiltroBarbero] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const queryTurnos = useQuery({queryKey: ['turnos', 'historial-crm'], queryFn: turnosApi.getHistorial,});
  const queryBarberos = useQuery({queryKey: ['barberos'],queryFn: barberosApi.getAll,enabled: false,});
  const clientesProcesados = useMemo(() => {
    const turnos = queryTurnos.data;
    if (!turnos || !Array.isArray(turnos)) return [];
    const turnosValidos = turnos.filter((t) => {
      const esHistorial = t.estado === 'COMPLETADO' || t.estado === 'CANCELADO' || t.estado === 'CONFIRMADO'; // Agregamos confirmados para que veas futuros
      const cumpleBarbero =
        filtroBarbero === 'todos' ||
        t.barbero?.id === filtroBarbero ||
        (t.barbero as any)?.usuario?.id === filtroBarbero;

      return esHistorial && cumpleBarbero;
    });
    const grupos = turnosValidos.reduce((acc, turno) => {
      const clienteId = turno.cliente?.id;
      if (!clienteId) return acc;
      if (!acc[clienteId]) {
        const u = turno.cliente.usuario;
        acc[clienteId] = {
          id: clienteId,
          fullname: u ? `${u.nombre} ${u.apellido}` : 'Cliente Desconocido',
          email: u?.email || '',
          telefono: (turno.cliente as any)?.telefono || '',
          totalTurnos: 0,
          totalGastado: 0,
          ultimaVisita: turno.fecha,
          historial: [],
          estadoCliente: 'NUEVO',
        };
      }
      acc[clienteId].historial.push(turno);
      if (turno.estado === 'COMPLETADO') {
        acc[clienteId].totalTurnos += 1;
        acc[clienteId].totalGastado += Number(turno.servicio?.precio || 0);
      }

      if (dayjs(turno.fecha).isAfter(dayjs(acc[clienteId].ultimaVisita))) {
        acc[clienteId].ultimaVisita = turno.fecha;
      }

      return acc;
    }, {} as Record<string, ClienteCRM>);

    let lista = Object.values(grupos).map((c) => {
      const hoy = dayjs();
      const ultima = dayjs(c.ultimaVisita);
      const diasSinVenir = hoy.diff(ultima, 'day');

      let etiqueta: ClienteCRM['estadoCliente'] = 'NUEVO';

      // Lógica de etiquetas
      if (c.totalTurnos === 0) etiqueta = 'NUEVO';
      else if (c.totalTurnos >= 10) etiqueta = 'VIP';
      else if (c.totalTurnos >= 3) etiqueta = 'FRECUENTE';
      if (diasSinVenir > 60 && c.totalTurnos > 0) etiqueta = 'INACTIVO';

      return { ...c, estadoCliente: etiqueta };
    });
    if (busqueda) {
      const lower = busqueda.toLowerCase();
      lista = lista.filter(c =>
        c.fullname.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower) ||
        c.telefono.toLowerCase().includes(lower)
      );
    }
    return lista.sort((a, b) => dayjs(b.ultimaVisita).valueOf() - dayjs(a.ultimaVisita).valueOf());
  }, [queryTurnos.data, filtroBarbero, busqueda]);
  return {
    clientes: clientesProcesados,
    barberos: queryBarberos.data || [],
    isLoading: queryTurnos.isLoading,
    filtros: {
      barbero: filtroBarbero,
      setBarbero: setFiltroBarbero,
      busqueda,
      setBusqueda
    }
  };
};