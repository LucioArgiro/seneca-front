import { Calendar, Clock, X, Edit2, Info, CheckCircle2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import type { TurnoResponse } from '../../api/turnos';

interface TurnoCardProps {
  turno: TurnoResponse;
  onCancel: (id: string) => void;
}

export const TurnoCard = ({ turno, onCancel }: TurnoCardProps) => {
  const navigate = useNavigate();
  
  // 1. ESTADOS DEL TURNO
  const isPendiente = turno.estado === 'PENDIENTE';
  const isConfirmado = turno.estado === 'CONFIRMADO';
  const isPagado = turno.pago?.estado === 'approved';

  // 2. CÁLCULOS DE DINERO 💰
  const precioTotal = Number(turno.servicio?.precio) || 0;
  const montoPagado = isPagado ? Number(turno.pago?.monto) : 0;
  // Calculamos cuánto falta pagar en el local
  const saldoPendiente = Math.max(0, precioTotal - montoPagado);

  // ¿Es un pago parcial (Seña)? 
  // Si pagó algo, pero todavía debe plata.
  const esSenia = montoPagado > 0 && saldoPendiente > 0;

  // 3. DATOS DE TIEMPO
  const fechaFormat = new Date(turno.fecha).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  const horaFormat = new Date(turno.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Regla de 12 horas para cancelar/reprogramar
  const fechaTurno = new Date(turno.fecha);
  const ahora = new Date();
  const diffHoras = (fechaTurno.getTime() - ahora.getTime()) / (1000 * 60 * 60);
  const HORAS_ANTICIPACION = 12;

  const puedeReprogramar = (isPendiente || isConfirmado) && diffHoras > HORAS_ANTICIPACION;
  const puedeCancelar = (isPendiente || isConfirmado) && !isPagado && diffHoras > HORAS_ANTICIPACION;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      
      {/* Borde lateral de estado */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isConfirmado ? 'bg-green-500' : (isPendiente ? 'bg-yellow-400' : 'bg-slate-300')}`}></div>

      <div className="flex flex-col sm:flex-row justify-between gap-6 pl-4">
        
        {/* === IZQUIERDA: INFORMACIÓN DEL TURNO === */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide border
              ${isConfirmado 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : (isPendiente ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-slate-100 text-slate-500 border-slate-200')
              }`}>
              {turno.estado}
            </span>
            <span className="text-xs text-slate-400 font-mono">#{turno.id.slice(0, 6)}</span>
            
            {/* Badge de Pagado Totalmente */}
            {isPagado && saldoPendiente === 0 && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10}/> Pagado
                </span>
            )}
             {/* Badge de Seña */}
             {esSenia && (
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10}/> Seña Abonada
                </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-1">{turno.servicio?.nombre}</h3>
          <p className="text-slate-500 text-sm mb-5 flex items-center gap-1">
            Con <span className="font-semibold text-slate-700">{turno.barbero?.usuario?.nombre} {turno.barbero?.usuario?.apellido}</span>
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

        {/* === DERECHA: PRECIOS Y ACCIONES === */}
        <div className="flex flex-col justify-between items-end gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 min-w-[160px]">
          
          {/* 👇 SECCIÓN DE PRECIOS DINÁMICA */}
          <div className="text-right w-full">
            
            {/* CASO A: PAGÓ SEÑA (Muestra desglose) */}
            {esSenia ? (
                <div className="bg-orange-50 rounded-xl p-2.5 border border-orange-100">
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                        <span>Servicio:</span>
                        <span className="line-through">${precioTotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-green-600 font-bold mb-2">
                        <span>Ya pagaste:</span>
                        <span>-${montoPagado}</span>
                    </div>
                    <div className="border-t border-orange-200 pt-1">
                        <p className="text-[10px] font-bold uppercase text-orange-800 text-right">Resta pagar</p>
                        <p className="text-2xl font-black text-orange-600 text-right tracking-tight flex items-center justify-end gap-1">
                             ${saldoPendiente}
                        </p>
                        <p className="text-[9px] text-orange-700 text-right leading-none mt-0.5">en el local</p>
                    </div>
                </div>
            ) : (
                // CASO B: PAGO TOTAL O PAGO PENDIENTE (Muestra total normal)
                <>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                        {saldoPendiente === 0 ? 'Total Pagado' : 'Total a Pagar'}
                    </p>
                    <span className={`text-3xl font-bold tracking-tight ${saldoPendiente === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                        ${precioTotal}
                    </span>
                </>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full mt-2">
            
            {puedeReprogramar && (
               <button
                 onClick={() => navigate('/reservar', { state: { modo: 'reprogramar', turno } })}
                 className="w-full px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
               >
                 <Edit2 size={14} /> Reprogramar
               </button>
            )}

            {puedeCancelar && (
              <button
                onClick={() => onCancel(turno.id)}
                className="w-full px-4 py-2 bg-white border border-red-100 hover:bg-red-50 text-red-500 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <X size={14} /> Cancelar
              </button>
            )}

            {/* Aviso Informativo si hay pago (Total o Seña) */}
            {montoPagado > 0 && (
                <div className="flex items-center justify-end gap-1.5 mt-1 opacity-60 hover:opacity-100 transition-opacity">
                    <Info size={12} className="text-slate-400"/>
                    <p className="text-[10px] text-slate-400">
                        Reserva abonada.
                    </p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};