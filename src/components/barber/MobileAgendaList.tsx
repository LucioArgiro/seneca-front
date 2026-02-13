import { Clock, Lock, User, Trash2, CalendarX, Plus } from 'lucide-react';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';

const generateTimeSlots = (start = 9, end = 21) => {
  const slots = [];
  for (let hour = start; hour < end; hour++) {
    slots.push(dayjs().hour(hour).minute(0).format('HH:mm'));
    slots.push(dayjs().hour(hour).minute(30).format('HH:mm'));
  }
  return slots;
};

interface Props {
  turnos: any[];
  bloqueos: any[];
  onTurnoClick: (turno: any) => void;
  onSlotClick: (time: string) => void;
  onDeleteBloqueo?: (id: string) => void;
}

export const MobileAgendaList = ({ turnos, bloqueos, onTurnoClick, onSlotClick, onDeleteBloqueo }: Props) => {
  const timeSlots = generateTimeSlots(9, 21);
  const bloqueoGeneral = bloqueos.find(b => b.esGeneral);
  const skippedSlots = new Set<string>();

  const handleDeleteRequest = (bloqueoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita conflictos
    if (!onDeleteBloqueo) return;

    // TOAST DE CONFIRMACIÓN (Igual que en AgendaGrid)
    toast((t) => (
      <div className="flex flex-col gap-2 min-w-[240px]">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-full text-red-500 shrink-0">
            <Trash2 size={18} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">¿Eliminar Bloqueo?</h4>
            <p className="text-zinc-400 text-xs">Esta acción liberará el horario.</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-white/5">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Cancelar</button>
          <button onClick={() => { onDeleteBloqueo(bloqueoId); toast.dismiss(t.id); }} className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center gap-1"><Trash2 size={12} /> Confirmar</button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: { background: '#1A1A1A', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }
    });
  };

  if (bloqueoGeneral) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden max-w-sm w-full">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40"></div>
          <CalendarX size={48} className="text-[#D4AF37] mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-serif text-[#D4AF37] mb-2 tracking-wide">DÍA CERRADO</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase mb-6 tracking-widest">Agenda Bloqueada</p>
          <div className="bg-[#131313] p-4 rounded-lg border border-zinc-800 mb-6">
            <p className="text-zinc-300 italic">"{bloqueoGeneral.motivo}"</p>
          </div>
          {onDeleteBloqueo && (
            <button onClick={(e) => handleDeleteRequest(bloqueoGeneral.id, e)} className="w-full py-3 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-xs font-bold uppercase tracking-widest">
              Desbloquear Día
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-24 p-4">
      {timeSlots.map((time) => {
        if (skippedSlots.has(time)) return null;

        const turno = turnos.find(t => dayjs(t.fecha).format('HH:mm') === time && t.estado !== 'CANCELADO');
        const bloqueo = bloqueos.find(b => dayjs(b.fechaInicio).format('HH:mm') === time && !b.esGeneral);

        if (turno) {
          const duration = turno.duracion || 30;
          const slotsToHide = Math.ceil(duration / 30) - 1;
          for (let i = 1; i <= slotsToHide; i++) {
            const nextTime = dayjs(turno.fecha).add(i * 30, 'minute').format('HH:mm');
            skippedSlots.add(nextTime);
          }
        }

        if (bloqueo) {
          const start = dayjs(bloqueo.fechaInicio);
          const end = dayjs(bloqueo.fechaFin);
          const duration = end.diff(start, 'minute');
          const slotsToHide = Math.ceil(duration / 30) - 1;
          for (let i = 1; i <= slotsToHide; i++) {
            const nextTime = start.add(i * 30, 'minute').format('HH:mm');
            skippedSlots.add(nextTime);
          }
        }

        const isCompletado = turno?.estado === 'COMPLETADO' || turno?.estado === 'COBRADO';
        const isConfirmado = turno?.estado === 'CONFIRMADO';
        const isPendiente = turno?.estado === 'PENDIENTE';
        const isBloqueado = !!bloqueo;
        const isLibre = !turno && !bloqueo;

        return (
          <div key={time} className="flex gap-4 group animate-in slide-in-from-bottom-2 duration-300">
            <div className="w-12 pt-3 text-right shrink-0">
              <span className="text-sm font-bold text-zinc-600 group-hover:text-[#D4AF37] transition-colors font-mono">{time}</span>
            </div>
            <div className="flex-1 relative pl-4 border-l border-zinc-800">
              <div className="absolute left-[-5px] top-4 w-2.5 h-2.5 rounded-full bg-[#131313] border-2 border-zinc-700 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] transition-all z-10"></div>

              {turno && (
                <div onClick={() => onTurnoClick(turno)} className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg relative overflow-hidden group/card ${isConfirmado ? 'bg-[#1A1A1A] border-[#D4AF37]/40' : isPendiente ? 'bg-amber-900/10 border-amber-600/40' : isCompletado ? 'bg-zinc-900/50 border-zinc-800 opacity-60' : 'bg-[#1A1A1A] border-zinc-800'}`} style={{ minHeight: `${(turno.duracion || 30) > 30 ? ((turno.duracion / 30) * 80) : 80}px` }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-bold text-base leading-tight ${isConfirmado ? 'text-[#FCD34D]' : 'text-white'}`}>{turno.servicio.nombre}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1"><User size={12} /><span className="capitalize">{turno.cliente.usuario.nombre} {turno.cliente.usuario.apellido}</span></div>
                    </div>
                    {isConfirmado && <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></div>}
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded bg-[#0a0a0a] border border-white/5 ${isConfirmado ? 'text-[#D4AF37]' : 'text-zinc-500'}`}><Clock size={10} />{dayjs(turno.fecha).format('HH:mm')} - {dayjs(turno.fecha).add(turno.duracion || 30, 'minute').format('HH:mm')}</div>
                  </div>
                </div>
              )}

              {/* CARD DE BLOQUEO CON BOTÓN DE BORRAR */}
              {isBloqueado && (
                <div
                  onClick={(e) => onDeleteBloqueo && handleDeleteRequest(bloqueo.id, e)}
                  className="p-3 rounded-xl bg-[#1A1A1A] border border-red-900/30 flex items-center justify-between group/bloqueo cursor-pointer hover:border-red-500/50 transition-colors relative overflow-hidden"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.05) 0px, rgba(239, 68, 68, 0.05) 10px, rgba(239, 68, 68, 0.02) 10px, rgba(239, 68, 68, 0.02) 20px)', minHeight: '80px' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#131313] p-1.5 rounded-md border border-red-500/20 text-red-500"><Lock size={14} /></div>
                    <div>
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">{bloqueo.motivo || 'OCUPADO'}</span>
                      <span className="text-[10px] text-red-500/50 font-mono">{dayjs(bloqueo.fechaInicio).format('HH:mm')} - {dayjs(bloqueo.fechaFin).format('HH:mm')}</span>
                    </div>
                  </div>

                  {/* 👇 ICONO DE BASURA SIEMPRE VISIBLE */}
                  {onDeleteBloqueo && (
                    <div className="bg-red-900/20 p-2 rounded-full text-red-500 border border-red-500/10">
                      <Trash2 size={16} />
                    </div>
                  )}
                </div>
              )}

              {isLibre && (
                <button onClick={() => onSlotClick(time)} className="w-full h-14 rounded-xl border border-dashed border-zinc-800/80 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all flex items-center justify-center gap-2 group/free">
                  <Plus size={16} className="text-zinc-700 group-hover/free:text-[#D4AF37] transition-colors" />
                  <span className="text-xs font-medium text-zinc-700 group-hover/free:text-[#D4AF37] transition-colors">Disponible</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};