import emailjs from '@emailjs/browser';

// Credenciales Generales
const SERVICE_ID = "service_lcbo5jp"; 
const PUBLIC_KEY = "Y5-nkSwz5RlGTK7H9"; 
const TEMPLATE_ID_CONTACTO = "template_981s86f"; 
const TEMPLATE_ID_RECUPERACION = "template_mcsfdb3";

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