import api from './axios'
import type { BarberoPerfil, UpdateBarberoDto, CreateBarberoDto} from '../types';

export const barberosApi = {
    getProfile: async (usuarioId: string) => {
        const { data } = await api.get<BarberoPerfil>(`/barberos/${usuarioId}`);
        return data;
    },

    updateProfile: async (datos: UpdateBarberoDto) => {
        const { data } = await api.patch<BarberoPerfil>('/barberos/me', datos);
        return data;
    },

    create: async (datos: CreateBarberoDto) => {
        const {data}= await api.post('/barberos', datos);
        return data;
    },
    
    getAll: async () => {
        // Esto llama al @Get() que creamos en el paso 1
        const { data } = await api.get<BarberoPerfil[]>('/barberos'); 
        return data;
    }
};