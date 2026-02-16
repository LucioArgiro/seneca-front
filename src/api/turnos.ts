import api from './axios';

export interface CreateTurnoDto {
  fecha: string;
  barberoId: string;
  servicioId: string;
  montoPagar?: number;
  tipoPago?: string;
}

export interface TurnoResponse {
  id: string;
  fecha: string;
  fechaFin: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'COMPLETADO' | 'CANCELADO';
  montoAbonado?: number;
  pago?: {
    id: string;
    estado: 'pending' | 'approved' | 'rejected' | 'in_process';
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
      nombre: string;
      apellido: string;
      email: string;
      telefono?: string;
    }
  };

  barbero: {
    id: string;
    precioSenia?: number;
    aliasMp?: string;      
    imagenQrUrl?: string;  
    usuario: {
      nombre: string;
      apellido: string;
      email: string;
      telefono?: string;
    }
  };
}

export const turnosApi = {
  getTurnos: async (params: any) => {
    const { data } = await api.get<TurnoResponse[]>('/turnos', { params });
    return data;
  },

  // 2. Crear Turno
  createTurno: async (dto: CreateTurnoDto): Promise<TurnoResponse> => {
    const { data } = await api.post<TurnoResponse>('/turnos', dto);
    return data;
  },

  // 3. Mis Turnos (Para el cliente o barbero logueado)
  getMyTurnos: async (): Promise<TurnoResponse[]> => {
    const { data } = await api.get<TurnoResponse[]>('/turnos/mis-turnos');
    return data;
  },

  // 4. Agenda del Barbero (Vista de admin/barbero)
  getAgendaBarbero: async (): Promise<TurnoResponse[]> => {
    const { data } = await api.get<TurnoResponse[]>('/turnos/agenda');
    return data;
  },

  // 5. Historial (CRM - Aquí estaba fallando el 403)
  getHistorial: async (): Promise<TurnoResponse[]> => {
    // Al usar 'api' (el cliente configurado), ahora enviará el Token automáticamente
    const { data } = await api.get<TurnoResponse[]>('/turnos/historial-clientes');
    return data;
  },

  // 6. Cancelar Turno
  cancelarTurno: async (id: string): Promise<void> => {
    await api.patch(`/turnos/${id}/cancelar`);
  },

  // 7. Actualizar Estado (Admin/Barbero)
  updateEstado: async (id: string, estado: 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO'): Promise<TurnoResponse> => {
    const { data } = await api.patch<TurnoResponse>(`/turnos/${id}/estado`, { estado });
    return data;
  },

  // 8. Reprogramar Turno
  reprogramarTurno: async (id: string, nuevaFecha: string): Promise<TurnoResponse> => {
    const { data } = await api.patch<TurnoResponse>(`/turnos/${id}/reprogramar`, { nuevaFecha });
    return data;
  },

  // 9. Consultar Disponibilidad (Horarios ocupados)
  getHorariosOcupados: async (fecha: string, barberoId: string): Promise<string[]> => {
    const { data } = await api.get<string[]>('/disponibilidad/ocupados', {
      params: { fecha, barberoId }
    });
    return data;
  },

  // 10. Crear Preferencia de Pago (MercadoPago)
  crearPreferenciaPago: async (id: string, tipoPago: 'SENIA' | 'TOTAL'): Promise<{ url: string }> => {
    const { data } = await api.post<{ url: string }>(`/turnos/${id}/preferencia`, { tipoPago });
    return data;
  },

  // 11. Completar Turno (Caja)
  completar: async (id: string, body: { metodoPago: string }): Promise<TurnoResponse> => {
    const { data } = await api.patch<TurnoResponse>(`/turnos/${id}/completar`, body);
    return data;
  }
};