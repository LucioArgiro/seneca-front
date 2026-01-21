import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { type BarberoPerfil } from '../types'; 

const START_HOUR = 9;
const END_HOUR = 22;
const PIXELS_PER_HOUR = 120;

interface AgendaGridProps {
  barberos: BarberoPerfil[];
  turnos: any[];
  bloqueos: any[];
  currentTimePosition: number | null;
  onSlotClick: (e: React.MouseEvent, barbero: BarberoPerfil, hora: number) => void;
  onDeleteBloqueo: (id: string) => void;
}

export const AgendaGrid = ({ barberos, turnos, bloqueos, currentTimePosition, onSlotClick, onDeleteBloqueo }: AgendaGridProps) => {
  const timeSlots = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const getPositionStyle = (fechaInicio: string, fechaFin: string) => {
    const start = dayjs(fechaInicio);
    const end = dayjs(fechaFin);
    const startHour = start.hour(); 
    const startMin = start.minute();
    const minutesFromStart = (startHour - START_HOUR) * 60 + startMin;
    const top = (minutesFromStart / 60) * PIXELS_PER_HOUR;
    const durationInHours = end.diff(start, 'minute') / 60;
    const height = durationInHours * PIXELS_PER_HOUR;

    return { top: `${top}px`, height: `${height}px` };
  };

  const handleClickInternal = (e: React.MouseEvent<HTMLDivElement>, barbero: BarberoPerfil) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const hoursFromStart = offsetY / PIXELS_PER_HOUR;
    const totalHours = START_HOUR + hoursFromStart;
    const hourRounded = Math.floor(totalHours); 
    
    onSlotClick(e, barbero, hourRounded);
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto relative flex scrollbar-thin scrollbar-thumb-slate-300">
      {/* COLUMNA HORAS */}
      <div className="w-16 flex-shrink-0 bg-white border-r border-slate-200 sticky left-0 z-30 pt-16">
        {timeSlots.map(hour => (
          <div key={hour} style={{ height: `${PIXELS_PER_HOUR}px` }} className="flex items-center justify-center relative border-b border-transparent">
            <span className="text-xs font-bold text-slate-400">{hour}:00</span>
            <div className="absolute right-0 top-1/2 w-2 border-t border-slate-200"></div>
          </div>
        ))}
      </div>

      {/* BARBEROS */}
      <div className="flex flex-1 min-w-[900px] bg-white">
        {barberos.map((barbero) => (
          <div key={barbero.id} className="flex-1 min-w-[200px] relative bg-white border-r border-slate-200 group">
            
            {/* Header */}
            <div className="sticky top-0 bg-white z-20 h-16 border-b border-slate-200 flex flex-col items-center justify-center shadow-sm">
              <span className="font-bold text-slate-800 text-base">{barbero.usuario.nombre} {barbero.usuario.apellido}</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1"></span>
            </div>

            {/* Zona Interactiva */}
            <div 
              className="relative w-full cursor-pointer hover:bg-slate-50/30 transition-colors"
              style={{ height: `${timeSlots.length * PIXELS_PER_HOUR}px` }}
              onClick={(e) => handleClickInternal(e, barbero)}
            >
              {/* Líneas Fondo */}
              <div className="absolute inset-0 pointer-events-none">
                {timeSlots.map(h => <div key={h} style={{ height: `${PIXELS_PER_HOUR}px` }} className="border-b border-slate-100 w-full" />)}
              </div>

              {/* Línea Tiempo */}
              {currentTimePosition !== null && (
                <div className="absolute w-full border-t-2 border-blue-500 z-10 pointer-events-none" style={{ top: `${currentTimePosition}px` }} />
              )}

              {/* Turnos */}
              {turnos.filter(t => t.barbero?.id === barbero.id && t.estado !== 'CANCELADO').map(turno => {
                 const style = getPositionStyle(turno.fecha, turno.fechaFin);
                 const cardClass = turno.estado === 'CONFIRMADO' ? "bg-[#0066FF] text-white" : "bg-white border-l-4 border-blue-500 text-slate-600";
                 return (
                    <div key={turno.id} style={{ ...style, left: '6px', right: '6px' }} onClick={(e) => e.stopPropagation()} className={`absolute rounded-lg p-2 text-xs shadow-sm overflow-hidden z-20 ${cardClass}`}>
                        <span className="font-bold">{dayjs(turno.fecha).format('HH:mm')}</span> - {turno.servicio.nombre}
                    </div>
                 )
              })}

              {/* Bloqueos - LÓGICA DE FILTRADO MEJORADA */}
              {bloqueos
                .filter(b => {
                    // Si es general, no va en columna (se maneja en el overlay)
                    if (b.esGeneral) return false;
                    // Verificamos si existe el objeto barbero y coincide el ID
                    return b.barbero?.id === barbero.id;
                })
                .map(bloqueo => {
                 const style = getPositionStyle(bloqueo.fechaInicio, bloqueo.fechaFin);
                 return (
                    <div 
                        key={bloqueo.id} 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ ...style, left: '4px', right: '4px' }} 
                        className="absolute bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 z-20 stripe-pattern hover:bg-slate-200 transition-colors"
                        title={`Bloqueo: ${bloqueo.motivo}`}
                    >
                        <span className="text-[10px] font-bold uppercase truncate px-1">{bloqueo.motivo || 'OCUPADO'}</span>
                        <button onClick={() => { if(confirm('¿Borrar?')) onDeleteBloqueo(bloqueo.id)}} className="absolute top-1 right-1 p-1 hover:text-red-500 bg-white/50 rounded-full"><X size={10}/></button>
                    </div>
                 )
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Overlay para Bloqueos Generales */}
      {bloqueos.find(b => b.esGeneral) && (
         /* ... Mismo código de overlay ... */
         <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-sm flex items-center justify-center">
             <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 text-center max-w-sm">
                <h2 className="text-2xl font-bold text-slate-800">Día Cerrado</h2>
                <p className="text-slate-500 mt-2 mb-6">"{bloqueos.find(b => b.esGeneral)?.motivo}"</p>
                <button onClick={() => { if(confirm('¿Reabrir?')) { const id = bloqueos.find(b => b.esGeneral)?.id; if(id) onDeleteBloqueo(id); }}} className="bg-slate-900 text-white px-4 py-2 rounded-lg">Abrir</button>
             </div>
         </div>
      )}
    </div>
  );
};