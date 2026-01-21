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
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <CalendarDays size={14} /> Jornada Laboral (Lun - Sáb)
      </h3>

      {/* 👇 CAMBIO CLAVE: Usamos flex-col con gap vertical para apilarlas */}
      <div className="flex flex-col gap-3">

        {/* OPCIÓN 1: MAÑANA */}
        <button
          type="button"
          onClick={() => toggleTurno('manana')}
          className={`
            relative w-full p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 text-left group
            ${turnosActivos.manana
              ? 'bg-white border-orange-400 shadow-md shadow-orange-500/10'
              : 'bg-white border-slate-200 hover:border-orange-200'}
          `}
        >
          {/* Icono con fondo */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors
            ${turnosActivos.manana ? 'bg-orange-50 text-orange-500' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-400'}
          `}>
            <Sun size={24} />
          </div>

          {/* Textos */}
          <div className="flex-1">
            <span className={`block font-bold text-sm ${turnosActivos.manana ? 'text-slate-800' : 'text-slate-500'}`}>
              Turno Mañana
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs font-medium text-slate-400">
              <Clock size={12} /> 09:00 - 14:00
            </div>
          </div>

          {/* Checkbox Visual */}
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${turnosActivos.manana
              ? 'bg-orange-500 border-orange-500'
              : 'border-slate-200 bg-slate-50'}
          `}>
            {turnosActivos.manana && <CheckCircle2 size={14} className="text-white" />}
          </div>
        </button>

        {/* OPCIÓN 2: TARDE */}
        <button
          type="button"
          onClick={() => toggleTurno('tarde')}
          className={`
            relative w-full p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 text-left group
            ${turnosActivos.tarde
              ? 'bg-white border-indigo-500 shadow-md shadow-indigo-500/10'
              : 'bg-white border-slate-200 hover:border-indigo-200'}
          `}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors
            ${turnosActivos.tarde ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'}
          `}>
            <Moon size={24} />
          </div>

          <div className="flex-1">
            <span className={`block font-bold text-sm ${turnosActivos.tarde ? 'text-slate-800' : 'text-slate-500'}`}>
              Turno Tarde
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs font-medium text-slate-400">
              <Clock size={12} /> 17:00 - 22:00
            </div>
          </div>

          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${turnosActivos.tarde
              ? 'bg-indigo-500 border-indigo-500'
              : 'border-slate-200 bg-slate-50'}
          `}>
            {turnosActivos.tarde && <CheckCircle2 size={14} className="text-white" />}
          </div>
        </button>
      </div>
    </div>
  );
};