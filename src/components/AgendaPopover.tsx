import {Ban, Coffee } from 'lucide-react';

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
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div
        className="fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 w-48 animate-in zoom-in-95 duration-100"
        style={{ top: Math.min(y, window.innerHeight - 200), left: Math.min(x, window.innerWidth - 200) }}
      >
        <div className="px-3 py-2 border-b border-slate-100 mb-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{data?.horaInicio}</p>
          <p className="text-sm font-bold text-slate-800 truncate">{data?.barberoNombre}</p>
        </div>
        <button onClick={() => onAction('BLOQUEAR')} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-3 transition font-medium">
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"><Ban size={14} /></div>
          Bloquear
        </button>
        <button onClick={() => onAction('DESCANSO')} className="w-full text-left px-3 py-2.5 hover:bg-orange-50 text-slate-700 hover:text-orange-700 rounded-lg flex items-center gap-3 transition font-medium">
          <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Coffee size={14} /></div>
          Descanso
        </button>
      </div>
    </>
  );
};