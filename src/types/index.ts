// FRONT/src/types/index.ts

export type UserRole = 'ADMIN' | 'BARBER' | 'CLIENT'; // 👈 Agregamos ADMIN

// 1. EL USUARIO BASE (Lo que viene de la tabla 'usuarios')
export interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}


export interface HorarioBarbero {
    id: string;
    diaSemana: number; // 0-6
    horaInicio: string; // "09:00"
    horaFin: string;    // "13:00"
}

export interface BarberoPerfil {
    id: string;
    // Datos propios del barbero
    biografia?: string;
    especialidad?: string;
    provincia?: string;
    pais?: string;
    fotoUrl?: string;
    activo: boolean;
    dni?: string;
    edad?: number;
    sexo?: string;
    telefono?: string;
    usuario: Usuario;
    promedio?: number;
    cantidadResenas?: number;
    horarios: HorarioBarbero[];
}


export interface ClientePerfil {
    id: string;
    telefono?: string;
    fotoUrl?: string;
    usuario: Usuario;
}


export interface CreateBarberoDto {
    nombre: string;   // 👈 Separado
    apellido: string;
    email: string;
    password: string;
    dni: string;
    telefono: string;
    edad: number;
    sexo: string;
    biografia?: string;
    especialidad?: string;
}

export interface UpdateBarberoDto {
    biografia?: string;
    especialidad?: string;
    provincia?: string;
    pais?: string;
    fotoUrl?: string;
    telefono?: string;
    dni?: string;
    edad?: number;
    sexo?: string;
    nombre?: string;   // 👈
    apellido?: string; //
    email?: string;
}

export interface UpdateClienteDto {
    telefono?: string;
    fotoUrl?: string;
    nombre?: string;   // 👈
    apellido?: string; // 👈
}

export interface Resena {
    id: string;
    calificacion: number;
    comentario: string;
    fecha: Date;
    cliente: ClientePerfil;
}