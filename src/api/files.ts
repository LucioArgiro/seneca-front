import api from './axios'; // Tu instancia de axios configurada

export const filesApi = {
    
    // Subir imagen
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const { data } = await api.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data.url; // Retorna la URL de Cloudinary
    },

    // Borrar imagen
    deleteImage: async (url: string) => {
        const { data } = await api.post('/files/delete', { url });
        return data;
    }
};