import dayjs from 'dayjs';
import { X, Lock, User, Clock, Trash2 } from 'lucide-react';
import { type BarberoPerfil } from '../../types';
import { toast } from 'react-hot-toast';

const START_HOUR = 9;
const END_HOUR = 22;
const TOTAL_HOURS = END_HOUR - START_HOUR + 1;
const ROW_HEIGHT = 120;
const CARD_HEIGHT = 60;

interface AgendaGridProps {
  barberos: BarberoPerfil[];
  turnos: any[];
  bloqueos: any[];
  currentTimePosition: number | null;
  onSlotClick: (e: React.MouseEvent, barbero: BarberoPerfil, hora: number) => void;
  onDeleteBloqueo: (id: string) => void;
  onTurnoClick?: (turno: any) => void;
}

export const AgendaGrid = ({ barberos, turnos, bloqueos, onSlotClick, onDeleteBloqueo, onTurnoClick }: AgendaGridProps) => {
  const timeSlots = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  const getStyle = (fechaInicio: string) => {
    const start = dayjs(fechaInicio);
    const startTotalMinutes = (start.hour() - START_HOUR) * 60 + start.minute();
    const top = (startTotalMinutes / 60) * ROW_HEIGHT;

    return {
      top: `${top}px`,
      height: `${CARD_HEIGHT}px`,
      zIndex: 20
    };
  };

  const handleGridClick = (e: React.MouseEvent, barbero: BarberoPerfil) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const clickedHour = START_HOUR + Math.floor(y / ROW_HEIGHT);

    if (clickedHour < END_HOUR) {
      onSlotClick(e, barbero, clickedHour);
    }
  };

  // Función para confirmar borrado con Toast
  const handleDeleteRequest = (bloqueoId: string, e: React.MouseEvent) => {
    e.stopPropagation();

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
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button onClick={() => {onDeleteBloqueo(bloqueoId); toast.dismiss(t.id);}}className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center gap-1"><Trash2 size={12} /> Confirmar</button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#1A1A1A',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }
    });
  };

  return (
    // 1. FONDO GENERAL: Negro Profundo (#0a0a0a)
    <div className="flex-1 w-full h-full overflow-auto bg-[#131313] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

      <div
        className="grid min-w-[800px]"
        style={{
          gridTemplateColumns: `60px repeat(${barberos.length}, 1fr)`,
          gridTemplateRows: `80px ${TOTAL_HOURS * ROW_HEIGHT}px`
        }}
      >

        {/* 1. ESQUINA SUPERIOR IZQUIERDA */}
        <div className="sticky top-0 z-25 bg-[#131313] flex items-center justify-center text-[#C9A227] border-b border-zinc-800">
          <Clock size={24} />
        </div>

        {/* 2. HEADERS (BARBEROS) */}
        {barberos.map(barbero => (
          <div key={`header-${barbero.id}`} className="sticky top-0 z-25 bg-[#131313] p-2 flex items-center justify-center border-b border-zinc-800">
            {/* Tarjeta del Barbero */}
            <div className="bg-[#141414] border border-zinc-800 hover:border-[#D4AF37]/50 rounded-xl w-full h-full flex flex-col items-center justify-center shadow-lg group transition-all duration-300">
              <span className="font-bold text-zinc-300 group-hover:text-white text-sm text-center leading-tight tracking-wide transition-colors">
                {barbero.usuario.nombre} <span className="text-[#D4AF37] opacity-80 group-hover:opacity-100">{barbero.usuario.apellido.charAt(0)}.</span>
              </span>
            </div>
          </div>
        ))}

        {/* 3. COLUMNA HORAS */}
        <div className="relative border-r border-zinc-800 bg-[#0a0a0a] z-10">
          {timeSlots.map((hour, index) => (
            <div
              key={hour}
              className="flex justify-center pt-2 text-[10px] font-bold text-zinc-600 font-mono"
              style={{ height: `${ROW_HEIGHT}px`, borderBottom: index < timeSlots.length - 1 ? '1px solid #141414' : 'none' }}
            >
              {hour}:00
            </div>
          ))}
        </div>

        {/* 4. COLUMNAS DE TURNOS */}
        {barberos.map(barbero => (
          <div
            key={`col-${barbero.id}`}
            className="relative border-r border-zinc-800/50 hover:bg-zinc-900/20 transition-colors cursor-pointer"
            onClick={(e) => handleGridClick(e, barbero)}
          >
            {/* LÍNEAS DE FONDO */}
            {timeSlots.map((h) => (
              <div key={h} className="w-full border-b border-zinc-900/80 box-border" style={{ height: `${ROW_HEIGHT}px` }}>
                <div className="w-full h-1/2 border-b border-zinc-900/40 border-dashed"></div>
              </div>
            ))}

            {/* === TURNOS === */}
            {turnos
              .filter(t => t.barbero?.id === barbero.id && t.estado !== 'CANCELADO')
              .map(turno => {
                const style = getStyle(turno.fecha);
                const isConfirmed = turno.estado === 'CONFIRMADO';
                const isPending = turno.estado === 'PENDIENTE';

                let cardStyles = "";
                let textClass = "";
                let iconColor = "";

                if (isConfirmed) {
                  cardStyles = "bg-[#D4AF37]/10 border border-[#D4AF37]/40 shadow-[0_4px_15px_rgba(212,175,55,0.05)] hover:border-[#D4AF37]";
                  textClass = "text-[#FCD34D]";
                  iconColor = "text-[#D4AF37]";
                } else if (isPending) {
                  cardStyles = "bg-amber-900/10 border-l-[3px] border-amber-600/60 shadow-sm hover:bg-amber-900/20";
                  textClass = "text-amber-200";
                  iconColor = "text-amber-500";
                } else {
                  cardStyles = "bg-[#1f1f1f] border border-zinc-700 opacity-60 grayscale hover:opacity-100 hover:grayscale-0";
                  textClass = "text-zinc-400";
                  iconColor = "text-zinc-500";
                }

                return (
                  <div
                    key={turno.id}
                    style={{ ...style, left: '6px', right: '6px', position: 'absolute' }}
                    onClick={(e) => { e.stopPropagation(); if (onTurnoClick) onTurnoClick(turno); }}
                    className={`
                        rounded-lg px-3 py-1.5 flex flex-col justify-center gap-0.5
                        transition-all duration-200 cursor-pointer 
                        hover:z-50 hover:scale-[1.02] hover:shadow-2xl
                        ${cardStyles}
                    `}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wide ${iconColor}`}>
                        <Clock size={11} strokeWidth={2.5} />
                        {dayjs(turno.fecha).format('HH:mm')}
                      </div>
                      {isPending && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>}
                      {isConfirmed && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></div>}
                    </div>
                    <div className="font-bold text-[11px] text-zinc-100 leading-tight truncate">{turno.servicio.nombre}</div>
                    <div className={`flex items-center gap-1 text-[10px] font-medium ${textClass} opacity-90 truncate`}>
                      <User size={10} />
                      <span className="truncate capitalize">{turno.cliente.usuario.nombre} {turno.cliente.usuario.apellido}</span>
                    </div>
                  </div>
                );
              })
            }

            {/* === BLOQUEOS (MEJORADOS) === */}
            {bloqueos
              .filter(b => !b.esGeneral && b.barbero?.id === barbero.id)
              .map(bloqueo => {
                const start = dayjs(bloqueo.fechaInicio);
                const end = dayjs(bloqueo.fechaFin);
                const rawTop = ((start.hour() - START_HOUR) * 60 + start.minute()) / 60 * ROW_HEIGHT;
                const rawHeight = (end.diff(start, 'minute') / 60) * ROW_HEIGHT;
                const gap = 4;
                const finalTop = rawTop + gap;
                const finalHeight = rawHeight - (gap * 2);

                return (
                  <div key={bloqueo.id} style={{top: `${finalTop}px`, height: `${finalHeight}px`,left: '4px', right: '4px', position: 'absolute', backgroundImage: 'repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.05) 0px, rgba(239, 68, 68, 0.05) 8px, rgba(239, 68, 68, 0.1) 10px, rgba(239, 68, 68, 0.1) 20px)'}} onClick={(e) => handleDeleteRequest(bloqueo.id, e)} className="group z-10 flex flex-col items-center justify-center rounded-lg border cursor-pointer border-red-500/30 bg-[#1A1A1A] hover:border-red-500/60 shadow-lg shadow-black/40 transition-all duration-200">
                    <div className="bg-[#131313]/90 px-3 py-1 rounded-full border border-red-500/20 flex items-center gap-2 backdrop-blur-sm shadow-sm scale-90 group-hover:scale-100 transition-transform"><Lock size={12} className="text-red-500"/><span className="text-[9px] font-bold text-red-400 uppercase tracking-wider truncate max-w-[100px]">{bloqueo.motivo || 'OCUPADO'}</span>
                    </div>

                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 scale-75 group-hover:scale-100"><div className="bg-red-900 text-white rounded-full p-1 border border-red-500 shadow-md hover:bg-red-700"><X size={10} strokeWidth={3} /></div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        ))}
      </div>

      {/* OVERLAY DE CERRADO (LUXURY NEGRO) */}
      {bloqueos.find(b => b.esGeneral) && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center ml-0 md:ml-64 mt-16 p-4">
          <div className="bg-[#0a0a0a] p-8 md:p-10 rounded-2xl border border-[#D4AF37]/20 text-center shadow-2xl shadow-black max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40"></div>

            <h2 className="text-3xl font-serif text-[#D4AF37] mb-2 tracking-wide">CERRADO</h2>
            <p className="text-zinc-600 font-bold text-[10px] uppercase mb-8 tracking-[0.4em]">Agenda Bloqueada</p>

            <div className="bg-[#141414] px-8 py-6 rounded-lg border border-zinc-800 mb-8">
              <p className="text-zinc-300 italic font-medium text-lg">"{bloqueos.find(b => b.esGeneral)?.motivo}"</p>
            </div>

            <button onClick={() => { const bloqueoGeneral = bloqueos.find(b => b.esGeneral); if (bloqueoGeneral) handleDeleteRequest(bloqueoGeneral.id, { stopPropagation: () => { } } as any); }} className="bg-transparent text-[#D4AF37] px-8 py-3 rounded-lg border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 font-bold tracking-widest uppercase text-[10px]">Desbloquear Día </button>
          </div>
        </div>
      )}
    </div>
  );
};