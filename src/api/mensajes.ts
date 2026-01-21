// src/api/mensajes.ts
import api from './axios';

export const mensajesApi = {

    create: async (contenido: string) => {
        const { data } = await api.post('/mensajes', { contenido });
        return data;
    },

    getMyMessages: async () => {
        const { data } = await api.get('/mensajes/mis-mensajes');
        return data;
    },

    getAll: async () => {
        const { data } = await api.get('/mensajes/buzon-general');
        return data;
    },

    reply: async (id: string, respuesta: string) => {
        const { data } = await api.patch(`/mensajes/${id}/responder`, { respuesta });
        return data;
    },

    delete: async(id:string)=> {await api.delete(`/mensajes/${id}`)},
    
    replyThread: async(id: string, texto:string)=>{ const {data}=await api.post(`/mensajes/${id}/reply`, {texto})
    return data;
}
};