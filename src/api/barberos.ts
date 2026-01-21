import api from './axios';
import type { BarberoPerfil, UpdateBarberoDto, CreateBarberoDto } from '../types';

export const barberosApi = {


    getAll: async () => {
        const { data } = await api.get<BarberoPerfil[]>('/barberos');
        return data;
    },

    getAllAdmin: async () => {
        const { data } = await api.get<BarberoPerfil[]>('/barberos/admin/all');
        return data;
    },

    getProfile: async (usuarioId: string) => {
        const { data } = await api.get<BarberoPerfil>(`/barberos/${usuarioId}`);
        return data;
    },


    create: async (datos: CreateBarberoDto) => {
        const { data } = await api.post('/barberos', datos);
        return data;
    },

    updateProfile: async (datos: UpdateBarberoDto) => {
        const { data } = await api.patch<BarberoPerfil>('/barberos/me', datos);
        return data;
    },

    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data.url;
    },

    deleteImage: async (url: string) => {
        // Enviamos la URL al backend para que él gestione el borrado
        const { data } = await api.post('/files/delete', { url });
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/barberos/${id}`);
        return data;
    },

    reactivate: async (id: string) => {
        const { data } = await api.patch(`/barberos/${id}/reactivate`);
        return data;
    },

    getOne: async (id: string): Promise<BarberoPerfil> => {
        // Este ID debe coincidir con el @Get(':usuarioId') del backend
        const { data } = await api.get(`/barberos/${id}`);
        return data;
    },

    update: async (id: string, payload: UpdateBarberoDto): Promise<BarberoPerfil> => {
        const { data } = await api.patch(`/barberos/${id}`, payload);
        return data;
    },
};