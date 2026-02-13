import { Calendar, Clock, Edit2, AlertTriangle, XCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TurnoResponse } from '../../api/turnos';
import { WhatsAppBtn } from '../common/WhatsAppBtn';
import dayjs from 'dayjs';

interface TurnoCardProps {
  turno: TurnoResponse;
  onCancel: (id: string) => void;
}

const TELEFONO_ADMIN = "5493815790448";

export const TurnoCard = ({ turno, onCancel }: TurnoCardProps) => {
  const navigate = useNavigate();
  const isPendiente = turno.estado === 'PENDIENTE';
  const isConfirmado = turno.estado === 'CONFIRMADO';
  const isCompletado = turno.estado === 'COMPLETADO';
  const estadoPago = turno.pago?.estado as string;
  const isPagado = estadoPago === 'approved';
  const isPagoPendiente = estadoPago === 'pending' || estadoPago === 'in_process';
  const precioTotal = Number(turno.servicio?.precio) || 0;
  const montoPagado = isPagado ? Number(turno.pago?.monto) : 0;
  const saldoPendiente = Math.max(0, precioTotal - montoPagado);
  const fechaObj = dayjs(turno.fecha);
  const fechaFormat = fechaObj.format('ddd D MMM'); 
  const horaFormat = fechaObj.format('HH:mm');
  const diffHoras = fechaObj.diff(dayjs(), 'hour');
  const HORAS_ANTICIPACION = 12;

  // Lógica de permisos
  const puedeReprogramar = !isCompletado && (isPendiente || isConfirmado) && diffHoras > HORAS_ANTICIPACION;
  const puedeCancelar = !isCompletado && (isPendiente || isConfirmado) && !isPagado && diffHoras > HORAS_ANTICIPACION;

  const telefonoContacto = turno.barbero?.usuario?.telefono || TELEFONO_ADMIN;

  return (
    <div className="bg-granular-dark rounded-2xl p-6 border border-[#C9A227]/30 shadow-xl relative overflow-hidden group w-full mx-auto hover:shadow-[0_0_20px_rgba(201,162,39,0.1)] transition-all">

      {/* === CABECERA === */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-2xl font-black text-white leading-tight mb-1">{turno.servicio?.nombre}</h3>
          <p className="text-zinc-400 text-sm flex items-center gap-1">
            con <span className="text-[#C9A227] font-bold">{turno.barbero?.usuario?.nombre} {turno.barbero?.usuario?.apellido}</span>
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className={`text-[10px] font-black py-1 rounded uppercase tracking-widest mb-1 inline-block
              ${isConfirmado ? 'text-[#C9A227]' : isPendiente ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
              {turno.estado}
          </span>
          <span className={`block text-3xl font-black tracking-tight ${saldoPendiente === 0 ? 'text-green-500' : 'text-zinc-300'}`}>
            ${precioTotal}
          </span>
          {saldoPendiente > 0 && (
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Resta: ${saldoPendiente}</p>
          )}
        </div>
      </div>

      {/* === FECHA === */}
      <div className="mb-6 pt-4 border-t border-white/5 flex items-center gap-6">
        <div className="flex items-center gap-2 text-zinc-300 text-sm">
          <Calendar size={16} className="text-[#C9A227]" />
          <span className="font-bold capitalize">{fechaFormat}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300 text-sm">
          <Clock size={16} className="text-[#C9A227]" />
          <span className="font-bold">{horaFormat} hs</span>
        </div>
        {isPagoPendiente && (
          <span className="ml-auto text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 flex items-center gap-1 font-bold">
            <AlertTriangle size={10} /> Procesando Pago
          </span>
        )}
      </div>

      {/* === FOOTER: BOTONES INTELIGENTES === */}
      {/* Usamos FLEX en lugar de GRID para que se adapten al espacio disponible */}
      <div className="flex flex-col md:flex-row gap-3">

        {/* 1. REPROGRAMAR (Solo si corresponde) */}
        {puedeReprogramar && (
          <button onClick={() => navigate('/reservar', { state: { modo: 'reprogramar', turno } })}
            className="flex-1 flex items-center justify-center gap-2 bg-[#131313] border border-[#C9A227]/50 hover:bg-[#C9A227] text-[#C9A227] hover:text-[#131313] rounded-xl py-3 transition-all group/btn font-bold text-xs uppercase tracking-wider">
            <Edit2 size={16} /> Reprogramar
          </button>
        )}

        {/* 2. CANCELAR (Solo si corresponde) */}
        {puedeCancelar && (
          <button onClick={() => onCancel(turno.id)} 
            className="flex-1 flex items-center justify-center gap-2 bg-[#131313] border border-[#C9A227]/50 hover:border-red-500/50 hover:bg-red-900/10 text-[#C9A227] hover:text-red-400 rounded-xl py-3 transition-all group/btn font-bold text-xs uppercase tracking-wider">
            <XCircle size={16} /> Cancelar
          </button>
        )}

        {/* 3. WHATSAPP (Siempre visible, ocupa el espacio restante) */}
        <div className="flex-1">
          <WhatsAppBtn 
            tipo="BUTTON" 
            label="" 
            className={`w-full h-full flex items-center justify-center gap-2 rounded-xl border transition-all py-3 font-bold text-xs uppercase tracking-wider 
            ${isCompletado
              ? 'bg-[#1A1A1A] text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'
              : 'bg-[#C9A227] text-[#131313] border-transparent hover:bg-[#131313] hover:text-[#C9A227] hover:border-[#C9A227]/50'
            }`} 
            telefono={telefonoContacto} 
            mensaje={isCompletado ? `Hola...` : `Hola...`}
          >
            <MessageCircle size={16} strokeWidth={2.5} />
            <span>{isCompletado ? 'Contactar' : 'Consultar'}</span>
          </WhatsAppBtn>
        </div>
      </div>
    </div>
  );
};