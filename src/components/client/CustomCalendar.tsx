import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importamos español

// Configuramos dayjs en español
dayjs.locale('es');

interface CustomCalendarProps {
  value: string; // Formato YYYY-MM-DD
  onChange: (date: string) => void;
}

export const CustomCalendar = ({ value, onChange }: CustomCalendarProps) => {
  // Estado para controlar qué mes estamos viendo (no necesariamente el seleccionado)
  const [currentDate, setCurrentDate] = useState(dayjs(value || new Date()));

  // Generar días del mes
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const daysInMonth = endOfMonth.date();
  
  // Días de relleno al inicio (para que el 1 caiga en el día correcto de la semana)
  // day() devuelve 0 (Domingo) a 6 (Sábado). 
  const startDayIndex = startOfMonth.day(); 

  // Generamos el array de días vacíos
  const emptyDays = Array.from({ length: startDayIndex });
  
  // Generamos el array de días reales (1 al 30/31)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Funciones de navegación
  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  // Manejo de selección
  const handleDateClick = (day: number) => {
    const newDate = currentDate.date(day);
    // Formato YYYY-MM-DD para que sea compatible con tu input
    onChange(newDate.format('YYYY-MM-DD'));
  };

  // Nombres de días de la semana (D, L, M, M, J, V, S)
  const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  return (
    <div className="w-full bg-[#131313] rounded-xl border border-[#333] overflow-hidden select-none">
      
      {/* --- HEADER DEL CALENDARIO (Mes y Flechas) --- */}
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-granular-dark">
        <button 
          onClick={prevMonth}
          // Deshabilitar si es mes anterior al actual
          disabled={currentDate.isSame(dayjs(), 'month')} 
          className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className="text-white font-bold capitalize text-lg tracking-wide">
          {currentDate.format('MMMM YYYY')}
        </h3>

        <button 
          onClick={nextMonth} 
          className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* --- GRILLA DE DÍAS --- */}
      <div className="p-4">
        
        {/* Nombres de días */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {weekDays.map((d) => (
            <span key={d} className="text-xs font-bold text-[#C9A227] uppercase opacity-70">
              {d}
            </span>
          ))}
        </div>

        {/* Días Numéricos */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          
          {/* Espacios vacíos del inicio */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {/* Días reales */}
          {daysArray.map((day) => {
            const dateToCheck = currentDate.date(day);
            const isSelected = value === dateToCheck.format('YYYY-MM-DD');
            const isToday = dateToCheck.isSame(dayjs(), 'day');
            const isPast = dateToCheck.isBefore(dayjs(), 'day');

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={isPast}
                className={`
                  h-10 w-full rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center relative
                  ${isPast 
                    ? 'text-zinc-700 cursor-not-allowed font-normal' // Pasado (apagado)
                    : isSelected
                      ? 'bg-[#C9A227] text-[#131313] shadow-[0_0_15px_rgba(201,162,39,0.4)] scale-105' // Seleccionado (Dorado)
                      : 'text-zinc-300 hover:bg-white/10 hover:text-white' // Normal
                  }
                  ${isToday && !isSelected ? 'border border-[#C9A227]/50 text-[#C9A227]' : ''} // Hoy (Borde)
                `}
              >
                {day}
                {/* Puntito indicador para "Hoy" */}
                {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 bg-[#C9A227] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};