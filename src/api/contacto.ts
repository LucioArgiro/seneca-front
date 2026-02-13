import emailjs from '@emailjs/browser';

// Credenciales Generales
const SERVICE_ID = "service_0tc4sa6"; 
const PUBLIC_KEY = "S21MKFYQSM-5ntn1X"; 
const TEMPLATE_ID_CONTACTO = "template_gmzod9m"; 
const TEMPLATE_ID_RECUPERACION = "template_y0dgsv6";

export interface ContactoData {
    nombre: string;
    email: string;
    mensaje: string;
}

export interface RecuperacionData {
    nombre: string;
    email: string;
    codigo: string;
}

export const emailApi = { 
    
    // 1. Para la sección de Contacto
    enviarContacto: async (data: ContactoData) => {
        try {
            const response = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID_CONTACTO,
                {
                    nombre: data.nombre,
                    email: data.email,
                    mensaje: data.mensaje, 
                },
                PUBLIC_KEY
            );
            return response.status === 200;
        } catch (error) {
            console.error("Error EmailJS Contacto:", error);
            throw error;
        }
    },

    enviarCodigoRecuperacion: async (data: RecuperacionData) => {
        try {
            const response = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID_RECUPERACION,
                {

                    nombre: data.nombre,
                    email_destino: data.email, 
                    codigo: data.codigo
                },
                PUBLIC_KEY
            );
            return response.status === 200;
        } catch (error) {
            console.error("Error EmailJS Recuperación:", error);
            throw error;
        }
    }
};