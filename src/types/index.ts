export type UserRole = 'BARBER' | 'CLIENT';

export interface Usuario {
    id: string;
    fullname: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}

export interface BarberoPerfil {
    id: string;
    usuarioId: string;
    fullname: string;
    email: string;
    biografia?: string;
    especialidad?: string;
    provincia?: string;
    pais?: string;
    fotoUrl?: string;
}

export interface ClientePerfil {
    id: string;
    usuarioId: string;
    fullname: string;
    email: string;
    telefono?: string;
}

export interface UpdateBarberoDto {
    biografia?: string;
    especialidad?: string;
    provincia?: string;
    pais?: string;
    fotoUrl?: string;
}

export interface CreateBarberoDto {
    fullname: string;
    email: string;
    password: string;
}

export interface UpdateClienteDto {
    telefono?: string;
    fotoUrl?: string;
}

export interface Resena {
    id: string;
    calificacion: number;
    comentario: string;
    fecha: Date; 
    cliente: {
        id: string;
        telefono?: string;
        fotoUrl?: string;
        usuario: Usuario;
    };
}