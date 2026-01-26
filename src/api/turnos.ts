import api from './axios';

// DTO para crear
export interface CreateTurnoDto {
  fecha: string;
  barberoId: string;
  servicioId: string;
}

// RESPUESTA LIMPIA
export interface TurnoResponse {
  id: string;
  fecha: string;
  fechaFin: string; // Importante para la agenda visual
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'COMPLETADO' | 'CANCELADO';
 
  pago?: {
    id: string;
    estado: 'pending' | 'approved' | 'rejected';
    monto: number;
    tipo: 'SENIA' | 'TOTAL';
  };
  
  servicio: {
    id: string;
    nombre: string;
    precio: number;
    duracionMinutos: number;
  };

  cliente: {
    id: string;
    usuario: {
      nombre: string;   // 👈 Corregido
      apellido: string; // 👈 Corregido
      email: string;
      telefono?: string;
    }
  };

  barbero: {
    id: string;
    usuario: {
      nombre: string;   // 👈 Corregido
      apellido: string; // 👈 Corregido
    }
  };
}

export const turnosApi = {
  // 1. Traer turnos (acepta filtro de fecha)
  getTurnos: async (fecha?: string): Promise<TurnoResponse[]> => {
    const url = fecha ? `/turnos?fecha=${fecha}` : '/turnos';
    const { data } = await api.get(url);
    return data;
  },

  // 2. Crear Turno
  createTurno: async (data: CreateTurnoDto): Promise<TurnoResponse> => {
    const { data: response } = await api.post('/turnos', data);
    return response;
  },

  // 3. Mis Turnos
  getMyTurnos: async (): Promise<TurnoResponse[]> => {
    const { data } = await api.get('/turnos/mis-turnos');
    return data;
  },

  // 4. Agenda del Barbero
  getAgendaBarbero: async (): Promise<TurnoResponse[]> => {
    const { data } = await api.get('/turnos/agenda');
    return data;
  },

  // 5. Historial
  getHistorial: async (): Promise<TurnoResponse[]> => {
    const { data } = await api.get('/turnos/historial-clientes');
    return data;
  },

  // 6. Cancelar
  cancelarTurno: async (id: string): Promise<void> => {
    await api.patch(`/turnos/${id}/cancelar`);
  },

  // 7. Update Estado
  updateEstado: async (id: string, estado: 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO'): Promise<TurnoResponse> => {
    const { data } = await api.patch(`/turnos/${id}/estado`, { estado });
    return data;
  },

  // 8. Reprogramar
  reprogramarTurno: async (id: string, nuevaFecha: string): Promise<TurnoResponse> => {
    const { data } = await api.patch(`/turnos/${id}/reprogramar`, { nuevaFecha });
    return data;
  },

  // 9. Disponibilidad
  getHorariosOcupados: async (fecha: string, barberoId: string): Promise<string[]> => {
    const { data } = await api.get('/disponibilidad/ocupados', {
      params: { fecha, barberoId }
    });
    return data;
  },

  crearPreferenciaPago: async (id: string, tipoPago: 'SENIA' | 'TOTAL'): Promise<{ url: string }> => {
    const { data } = await api.post(`/turnos/${id}/preferencia`, { tipoPago });
    return data;
  }

};