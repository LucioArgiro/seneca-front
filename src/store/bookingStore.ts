import { create } from 'zustand';
import { type Usuario } from '../types/index';

// Definimos qué datos guardaremos mientras el cliente reserva
interface BookingState {
  step: number;          // Paso actual (1: Barbero, 2: Servicio, 3: Fecha...)
  selectedBarber: Usuario | null;
  selectedServiceId: string | null;
  selectedDate: Date | null;
  nota: string;          // El mensaje que querías agregar
  
  // Acciones (Funciones para cambiar los datos)
  setBarber: (barber: Usuario) => void;
  setService: (serviceId: string) => void;
  setDate: (date: Date) => void;
  setNota: (nota: string) => void;
  resetBooking: () => void; // Para limpiar todo al terminar
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  selectedBarber: null,
  selectedServiceId: null,
  selectedDate: null,
  nota: '',

  setBarber: (barber) => set({ selectedBarber: barber, step: 2 }), // Avanza paso auto
  setService: (serviceId) => set({ selectedServiceId: serviceId }),
  setDate: (date) => set({ selectedDate: date }),
  setNota: (nota) => set({ nota }),
  
  resetBooking: () => set({ 
    step: 1, 
    selectedBarber: null, 
    selectedServiceId: null, 
    selectedDate: null, 
    nota: '' 
  }),
}));