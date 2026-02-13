import api from './axios';

export interface Movimiento {
    id: string;
    tipo: 'INGRESO' | 'EGRESO';
    concepto: string;
    monto: number;
    descripcion: string;
    fecha: string; // ISO Date
    metodoPago: string; // 'EFECTIVO', 'TRANSFERENCIA', etc.

    // 👇 DATOS CLAVE PARA EL HISTORIAL DETALLADO
    usuario?: {
        id: string;
        nombre: string;
        apellido: string;
    };
    turno?: {
        id: string;
        servicio: { nombre: string };
        cliente: {
            usuario: { nombre: string; apellido: string }
        };
    };
}

export interface CajaResponse {
    info: {
        id: string;
        // Para el Admin: Es el dinero físico en caja.
        // Para el Barbero: Es su "Saldo a Favor" (Lo que generó - Lo que retiró).
        saldo: number;
    };
    movimientos: Movimiento[];
}

export const cajaApi = {
    // 1. Obtener mi propia caja (Barbero o Admin default)
    getMiCaja: async () => {
        const { data } = await api.get('/caja/me');
        return data;
    },

    // 2. Obtener la caja central explícitamente (Admin)
    getCajaCentral: async () => {
        // Asumimos que el backend entiende que sin param o con param especial devuelve la central
        // O si tienes un endpoint específico: api.get('/caja/central')
        // Si no, usamos getMiCaja si el admin es el dueño
        const { data } = await api.get('/caja/me');
        return data;
    },

    // 3. Obtener caja de un usuario específico (Para el selector del Admin)
    getCajaByUserId: async (userId: string) => {
        // Necesitas un endpoint en backend tipo: @Get('admin/:userId')
        const { data } = await api.get(`/caja/admin/${userId}`);
        return data;
    },

    // 4. Listar todas las cajas (Para llenar el dropdown del selector)
    getAllCajas: async () => {
        const { data } = await api.get('/caja/admin/all');
        return data;
    },

    // 5. Crear movimiento
    crearMovimiento: async (payload: {
        tipo: 'INGRESO' | 'EGRESO';
        concepto: string;
        monto: number;
        descripcion: string;
        usuarioId?: string;
    }) => {
        const { data } = await api.post('/caja/movimiento', payload);
        return data;
    }
};