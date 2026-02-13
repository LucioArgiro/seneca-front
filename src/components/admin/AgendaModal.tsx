import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, User, Clock, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

// Constantes
const START_HOUR = 8;
const END_HOUR = 23;

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
      setMotivo(config.type === 'GENERAL' ? '' : 'Descanso / Trámite');
      setHoraInicio(config.horaInicio || '');
      setHoraFin(config.horaFin || '');
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  // Generar opciones de hora
  const timeOptions = Array.from({ length: END_HOUR - START_HOUR + 2 }, (_, i) => {
    const h = START_HOUR + i;
    return `${h.toString().padStart(2, '0')}:00`;
  });

  const handleSubmit = () => {
    onConfirm({ motivo, horaInicio, horaFin });
  };

  return (
    // Overlay oscuro con desenfoque
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 ">
      
      {/* Modal Card: Fondo Carbón (#1A1A1A) con borde dorado sutil */}
      <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-white/10 relative">
        

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#131313]">
          <h3 className="font-bold text-lg text-white tracking-wide">
            {config.type === 'GENERAL' ? 'CERRAR LOCAL' : 'BLOQUEAR HORARIO'}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-[#C9A227] hover:bg-white/5 p-1.5 rounded-full transition-colors"><X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          
          {/* INFO BOX (Ticket Style) */}
          <div className="bg-[#131313] border border-white/5 rounded-xl p-4 flex gap-4 items-cente">
            <div className="text-[#C9A227] p-3 rounded-lg hover:bg-[#C9A227] hover:text-[#131313]">
              {config.type === 'GENERAL' ? <CalendarIcon size={20} /> : <User size={20} />}
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-1 opacity-90">
                {config.type === 'GENERAL' ? 'BLOQUEO DE DÍA' : `BARBERO: ${config.barberoNombre}`}
              </p>
              <p className="text-sm font-bold text-slate-200 capitalize">
                {selectedDate.format('dddd, D [de] MMMM')}
              </p>
            </div>
          </div>

          {/* SELECTORES DE HORA */}
          {config.type === 'PARTICULAR' && (
            <div className="grid grid-cols-2 gap-4">
              {['Inicio', 'Fin'].map((label, idx) => (
                <div key={label}>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-2 ml-1">{label}</label>
                  <div className="relative group">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#C9A227] transition-colors pointer-events-none" size={16} />
                    <select
                      value={idx === 0 ? horaInicio : horaFin}
                      onChange={e => idx === 0 ? setHoraInicio(e.target.value) : setHoraFin(e.target.value)}
                      className="w-full pl-10 pr-8 py-3 bg-[#131313] border border-zinc-800 rounded-xl font-bold text-slate-200 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none appearance-none cursor-pointer transition-all"
                    >
                      {timeOptions.map(time => <option key={`${label}-${time}`} value={time}>{time}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INPUT MOTIVO */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2 ml-1">Motivo del bloqueo</label>
            <input autoFocus type="text"  value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder={config.type === 'GENERAL' ? "Ej: Feriado nacional..." : "Ej: Almuerzo..."} className="w-full p-3 bg-[#131313] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition font-medium"/></div>

          {/* BOTÓN DE CONFIRMACIÓN */}
          <button onClick={handleSubmit} disabled={isPending || !motivo || (config.type === 'PARTICULAR' && (!horaInicio || !horaFin))} className="w-full py-4 rounded-xl font-bold tracking-wide text-[#C9A227] bg-[#131313] rounded-lg hover:bg-[#C9A227] hover:text-[#131313] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 border border-[#C9A227]/30">{isPending ? 'PROCESANDO...' : 'CONFIRMAR BLOQUEO'}</button>
        </div>
      </div>
    </div>
  );
};