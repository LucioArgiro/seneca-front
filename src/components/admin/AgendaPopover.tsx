import { Ban, Coffee } from 'lucide-react';

interface AgendaPopoverProps {
  isOpen: boolean;
  x: number;
  y: number;
  data: { horaInicio: string; barberoNombre: string } | undefined;
  onClose: () => void;
  onAction: (action: 'BLOQUEAR' | 'AGENDAR' | 'DESCANSO') => void;
}

export const AgendaPopover = ({ isOpen, x, y, data, onClose, onAction }: AgendaPopoverProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop invisible para cerrar al hacer click fuera */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      {/* Popover Card */}
      <div
        className="fixed z-50 bg-[#1A1A1A] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)] border border-white/10 p-2 w-52 animate-in zoom-in-95 duration-100"
        style={{ top: Math.min(y, window.innerHeight - 200), left: Math.min(x, window.innerWidth - 200) }}
      >
        {/* Header del Popover */}
        <div className="px-3 py-2 border-b border-white/5 mb-1">
          <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-0.5">
             {data?.horaInicio}
          </p>
          <p className="text-sm font-bold text-white truncate capitalize">
             {data?.barberoNombre}
          </p>
        </div>

        {/* Botón Bloquear */}
        <button 
            onClick={() => onAction('BLOQUEAR')} 
            className="w-full text-left px-3 py-2.5 hover:bg-red-900/10 text-zinc-400 hover:text-red-400 rounded-lg flex items-center gap-3 transition-colors font-medium group"
        >
          <div className="w-7 h-7 rounded-md bg-[#131313] border border-white/5 text-zinc-600 group-hover:text-red-400 group-hover:border-red-900/30 flex items-center justify-center transition-colors">
            <Ban size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide">Bloquear</span>
        </button>

        {/* Botón Descanso */}
        <button 
            onClick={() => onAction('DESCANSO')} 
            className="w-full text-left px-3 py-2.5 hover:bg-[#C9A227]/10 text-zinc-400 hover:text-[#C9A227] rounded-lg flex items-center gap-3 transition-colors font-medium group"
        >
          <div className="w-7 h-7 rounded-md bg-[#131313] border border-white/5 text-zinc-600 group-hover:text-[#C9A227] group-hover:border-[#C9A227]/30 flex items-center justify-center transition-colors">
            <Coffee size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide">Descanso</span>
        </button>
      </div>
    </>
  );
};