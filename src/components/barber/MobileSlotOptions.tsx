import {Ban, Coffee, X } from 'lucide-react';
import dayjs from 'dayjs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // 👇 Actualizamos las acciones para que coincidan con tu sistema
  onAction: (action: 'AGENDAR' | 'BLOQUEAR' | 'DESCANSO') => void; 
  data: any;
}

export const MobileSlotOptions = ({ isOpen, onClose, onAction, data }: Props) => {
  if (!isOpen || !data) return null;

  // Si data viene de AgendaGrid puede tener 'date', si viene de otro lado puede ser distinto.
  // Aseguramos formato de hora:
  const fechaObj = data.date || data.fechaInicio || new Date(); 
  const horaLegible = dayjs(fechaObj).format('HH:mm');

  return (
    <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 animate-in fade-in duration-200" 
        onClick={onClose}
    >
      
      {/* Card Flotante */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1A1A1A] w-72 rounded-2xl border border-[#C9A227]/30 shadow-2xl shadow-black flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        
        {/* Header */}
        <div className="bg-[#131313] px-5 py-4 border-b border-white/5 flex justify-between items-center">
            <div>
                <span className="text-[#C9A227] font-bold text-xs uppercase tracking-widest block mb-1">Horario</span>
                <span className="text-white font-black text-xl">{horaLegible} hs</span>
            </div>
            <button 
                onClick={onClose} 
                className="bg-zinc-800/50 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
            >
                <X size={16}/>
            </button>
        </div>

        {/* Lista de Acciones */}
        <div className="p-3 flex flex-col gap-2">
            {/* 2. BLOQUEAR */}
            <button 
                onClick={() => { onAction('BLOQUEAR'); onClose(); }}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-900/10 border border-transparent hover:border-red-900/30 rounded-xl group transition-all active:scale-95"
            >
                <div className="bg-[#131313] border border-white/10 text-zinc-500 group-hover:text-red-500 group-hover:border-red-500/30 p-2.5 rounded-lg transition-colors">
                    <Ban size={20} />
                </div>
                <div className="text-left">
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-red-400 transition-colors block">Bloquear Hora</span>
                    <span className="text-[10px] text-zinc-500 group-hover:text-red-500/50">No disponible para turnos</span>
                </div>
            </button>

            {/* 3. DESCANSO */}
            <button 
                onClick={() => { onAction('DESCANSO'); onClose(); }}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#C9A227]/5 border border-transparent hover:border-[#C9A227]/20 rounded-xl group transition-all active:scale-95"
            >
                <div className="bg-[#131313] border border-white/10 text-zinc-500 group-hover:text-[#C9A227] group-hover:border-[#C9A227]/30 p-2.5 rounded-lg transition-colors">
                    <Coffee size={20} />
                </div>
                <div className="text-left">
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-[#C9A227] transition-colors block">Marcar Descanso</span>
                    <span className="text-[10px] text-zinc-500 group-hover:text-[#C9A227]/50">Pausa breve o café</span>
                </div>
            </button>

        </div>
      </div>
    </div>
  );
};