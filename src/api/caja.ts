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
        saldo: number;
        nombre?: string;
        usuario?: any;
        seniasMes?: number;
    };
    movimientos: Movimiento[];
}

export const cajaApi = {
    // 1. Obtener mi propia caja (Barbero o Admin default)
    getMiCaja: async () => {
        const { data } = await api.get('/caja/me');
        return data;
    },
    downloadExcel: async (cajaId: string, mes: number, anio: number) => {
        // NOTA: responseType: 'blob' es CRUCIAL para descargar archivos
        const response = await api.get('/caja/exportar', {
            params: { cajaId, mes, anio },
            responseType: 'blob'
        });

        // Crear URL temporal para descargar
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Reporte_${mes}_${anio}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },


    getCajaCentral: async () => {
        const { data } = await api.get('/caja/me');
        return data;
    },


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