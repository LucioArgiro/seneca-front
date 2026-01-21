import { Calendar, Clock, X, Edit2 } from 'lucide-react'; // 👈 Agregamos Edit2
import { useNavigate } from 'react-router-dom'; // 👈 Agregamos useNavigate
import type { TurnoResponse } from '../../api/turnos';

interface TurnoCardProps {
  turno: TurnoResponse;
  onCancel: (id: string) => void;
}

export const TurnoCard = ({ turno, onCancel }: TurnoCardProps) => {
  const navigate = useNavigate(); // 👈 Inicializamos el hook
  const isPendiente = turno.estado === 'PENDIENTE';
  
  // Helpers de formato
  const fechaFormat = new Date(turno.fecha).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  const horaFormat = new Date(turno.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 👇 LÓGICA DE REPROGRAMACIÓN (Regla de 2 horas)
  const fechaTurno = new Date(turno.fecha);
  const ahora = new Date();
  const diffHoras = (fechaTurno.getTime() - ahora.getTime()) / (1000 * 60 * 60);
  // Se puede reprogramar si es pendiente y faltan más de 2 horas
  const puedeReprogramar = isPendiente && diffHoras > 2;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      
      {/* Borde lateral de estado */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isPendiente ? 'bg-yellow-400' : 'bg-green-500'}`}></div>

      <div className="flex flex-col sm:flex-row justify-between gap-6 pl-4">
        
        {/* Info Principal */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide border
              ${isPendiente 
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                : 'bg-green-50 text-green-700 border-green-200'
              }`}>
              {turno.estado}
            </span>
            <span className="text-xs text-slate-400 font-mono">#{turno.id.slice(0, 6)}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-1">{turno.servicio?.nombre}</h3>
          <p className="text-slate-500 text-sm mb-5 flex items-center gap-1">
            Con <span className="font-semibold text-slate-700">{turno.barbero?.usuario?.fullname}</span>
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Calendar size={16} className="text-blue-500" />
              <span className="font-medium capitalize">{fechaFormat}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Clock size={16} className="text-blue-500" />
              <span className="font-medium">{horaFormat} hs</span>
            </div>
          </div>
        </div>

        {/* Precio y Acciones */}
        <div className="flex flex-col justify-between items-end gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase">Total</p>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">${turno.servicio?.precio}</span>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {/* 👇 BOTÓN REPROGRAMAR (Nuevo) */}
            {puedeReprogramar && (
               <button
                 onClick={() => navigate('/reservar', { state: { modo: 'reprogramar', turno } })}
                 className="px-4 py-2 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
               >
                 <Edit2 size={14} /> Reprogramar
               </button>
            )}

            {/* BOTÓN CANCELAR */}
            {isPendiente && (
              <button
                onClick={() => onCancel(turno.id)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-400 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <X size={14} /> Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

