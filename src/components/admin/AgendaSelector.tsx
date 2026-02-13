import { useState, useEffect } from 'react';
import { Sun, Moon, CheckCircle2, CalendarDays, Clock } from 'lucide-react';

interface HorarioInput {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

interface AgendaSelectorProps {
  value?: HorarioInput[];
  onChange: (nuevosHorarios: HorarioInput[]) => void;
}

const DIAS_LABORALES = [1, 2, 3, 4, 5, 6]; 

export const AgendaSelector = ({ value = [], onChange }: AgendaSelectorProps) => {
  const [turnosActivos, setTurnosActivos] = useState<{ manana: boolean; tarde: boolean }>({
    manana: false,
    tarde: false
  });

  useEffect(() => {
    if (value && value.length > 0) {
      const hasManana = value.some(h => parseInt(h.horaInicio) < 14);
      const hasTarde = value.some(h => parseInt(h.horaInicio) >= 17);
      setTurnosActivos(prev => {
        if (prev.manana !== hasManana || prev.tarde !== hasTarde) {
          return { manana: hasManana, tarde: hasTarde };
        }
        return prev;
      });
    }
  }, [value]);

  useEffect(() => {
    const nuevosHorarios: HorarioInput[] = [];

    DIAS_LABORALES.forEach((diaIndex) => {
      if (turnosActivos.manana) {
        nuevosHorarios.push({ diaSemana: diaIndex, horaInicio: '09:00', horaFin: '14:00' });
      }
      if (turnosActivos.tarde) {
        nuevosHorarios.push({ diaSemana: diaIndex, horaInicio: '17:00', horaFin: '21:00' });
      }
    });
    onChange(nuevosHorarios);

  }, [turnosActivos]);


  const toggleTurno = (turno: 'manana' | 'tarde') => {
    setTurnosActivos(prev => ({ ...prev, [turno]: !prev[turno] }));
  };

  return (
    // FONDO: Carbón (#1A1A1A) para destacar sobre el fondo general
    <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 shadow-xl">
      <h3 className="text-xs font-bold text-[#C9A227] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 opacity-90">
        <CalendarDays size={14} /> Jornada Laboral (Lun - Sáb)
      </h3>

      <div className="flex flex-col gap-3">

        {/* OPCIÓN 1: MAÑANA */}
        <button
          type="button"
          onClick={() => toggleTurno('manana')}
          className={`
            relative w-full p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 text-left group
            ${turnosActivos.manana
              ? 'bg-[#C9A227]/5 border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.1)]' // Activo: Brillo Dorado
              : 'bg-[#131313] border-zinc-800 hover:border-[#C9A227]/30 hover:bg-[#131313]/80'} // Inactivo: Oscuro
          `}
        >
          {/* Icono con fondo */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
            ${turnosActivos.manana 
                ? 'bg-[#C9A227]/20 text-[#C9A227]' 
                : 'bg-zinc-800 text-zinc-500 group-hover:text-[#C9A227]'}
          `}>
            <Sun size={24} />
          </div>

          {/* Textos */}
          <div className="flex-1">
            <span className={`block font-bold text-sm ${turnosActivos.manana ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
              Turno Mañana
            </span>
            <div className={`flex items-center gap-1.5 mt-0.5 text-xs font-medium ${turnosActivos.manana ? 'text-[#C9A227]' : 'text-zinc-500'}`}>
              <Clock size={12} /> 09:00 - 14:00
            </div>
          </div>

          {/* Checkbox Visual */}
          <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all
            ${turnosActivos.manana
              ? 'bg-[#C9A227] border-[#C9A227] text-[#131313]'
              : 'border-zinc-700 bg-zinc-800'}
          `}>
            {turnosActivos.manana && <CheckCircle2 size={14} />}
          </div>
        </button>

        {/* OPCIÓN 2: TARDE */}
        <button
          type="button"
          onClick={() => toggleTurno('tarde')}
          className={`
            relative w-full p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 text-left group
            ${turnosActivos.tarde
              ? 'bg-[#C9A227]/5 border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.1)]'
              : 'bg-[#131313] border-zinc-800 hover:border-[#C9A227]/30 hover:bg-[#131313]/80'}
          `}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
            ${turnosActivos.tarde 
                ? 'bg-[#C9A227]/20 text-[#C9A227]' 
                : 'bg-zinc-800 text-zinc-500 group-hover:text-[#C9A227]'}
          `}>
            <Moon size={24} />
          </div>

          <div className="flex-1">
            <span className={`block font-bold text-sm ${turnosActivos.tarde ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
              Turno Tarde
            </span>
            <div className={`flex items-center gap-1.5 mt-0.5 text-xs font-medium ${turnosActivos.tarde ? 'text-[#C9A227]' : 'text-zinc-500'}`}>
              <Clock size={12} /> 17:00 - 22:00
            </div>
          </div>

          <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all
            ${turnosActivos.tarde
              ? 'bg-[#C9A227] border-[#C9A227] text-[#131313]'
              : 'border-zinc-700 bg-zinc-800'}
          `}>
            {turnosActivos.tarde && <CheckCircle2 size={14} />}
          </div>
        </button>
      </div>
    </div>
  );
};