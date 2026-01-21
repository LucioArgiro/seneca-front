import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, User, Clock, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

// Constantes
const START_HOUR = 9;
const END_HOUR = 22;

interface AgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { motivo: string; horaInicio?: string; horaFin?: string }) => void;
  isPending: boolean;
  config: {
    type: 'GENERAL' | 'PARTICULAR';
    barberoNombre?: string;
    horaInicio?: string;
    horaFin?: string;
  };
  selectedDate: dayjs.Dayjs;
}

export const AgendaModal = ({ isOpen, onClose, onConfirm, isPending, config, selectedDate }: AgendaModalProps) => {
  const [motivo, setMotivo] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  // Reiniciar o cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setMotivo(config.type === 'GENERAL' ? '' : 'Descanso / Trámite'); // Default sugerido
      setHoraInicio(config.horaInicio || '');
      setHoraFin(config.horaFin || '');
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  // Generar opciones de hora (09:00, 10:00...)
  const timeOptions = Array.from({ length: END_HOUR - START_HOUR + 2 }, (_, i) => {
    const h = START_HOUR + i;
    return `${h.toString().padStart(2, '0')}:00`;
  });

  const handleSubmit = () => {
    onConfirm({ motivo, horaInicio, horaFin });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">
            {config.type === 'GENERAL' ? 'Cerrar Local (Día Completo)' : 'Bloquear Horario'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full shadow-sm border border-slate-100"><X size={18} /></button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          
          {/* INFO BOX */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg h-fit">
              {config.type === 'GENERAL' ? <CalendarIcon size={18} /> : <User size={18} />}
            </div>
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-0.5">
                {config.type === 'GENERAL' ? 'Fecha seleccionada' : `Profesional: ${config.barberoNombre}`}
              </p>
              <p className="text-sm font-bold text-slate-800 capitalize">
                {selectedDate.format('dddd, D [de] MMMM')}
              </p>
            </div>
          </div>

          {/* SELECTORES DE HORA */}
          {config.type === 'PARTICULAR' && (
            <div className="grid grid-cols-2 gap-4">
              {['Inicio', 'Fin'].map((label, idx) => (
                <div key={label}>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select
                      value={idx === 0 ? horaInicio : horaFin}
                      onChange={e => idx === 0 ? setHoraInicio(e.target.value) : setHoraFin(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer"
                    >
                      {timeOptions.map(time => <option key={`${label}-${time}`} value={time}>{time}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INPUT MOTIVO */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Motivo</label>
            <input
              autoFocus
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder={config.type === 'GENERAL' ? "Ej: Feriado nacional..." : "Ej: Almuerzo..."}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-medium"
            />
          </div>

          {/* BOTÓN */}
          <button
            onClick={handleSubmit}
            disabled={isPending || !motivo || (config.type === 'PARTICULAR' && (!horaInicio || !horaFin))}
            className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-900/10 disabled:opacity-70 disabled:shadow-none transition"
          >
            {isPending ? 'Procesando...' : 'Confirmar Bloqueo'}
          </button>
        </div>
      </div>
    </div>
  );
};